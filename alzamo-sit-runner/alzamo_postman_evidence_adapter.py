#!/usr/bin/env python3
"""Minimal ALZAMO v2.0 POC adapter: Postman CLI JSON/ZIP -> evidence JSON.

Usage: python3 alzamo_postman_evidence_adapter.py sit-008-results.json -o alzamo-evidence.json
   or: python3 alzamo_postman_evidence_adapter.py alzamo-pst-v5-sit-008-evidence.zip -o alzamo-evidence.json

Read-only: does not call any API or mutate the test environment. Intended for the
approved PST v5 Cart POC, not a generic external-runner trust/authorization gate.
"""
import argparse
import json
from pathlib import Path
import zipfile
from datetime import datetime, timezone

MAX_REPORT_BYTES = 5_000_000


def load_report(path: Path):
    if path.suffix.lower() == '.zip':
        with zipfile.ZipFile(path) as archive:
            names = [x for x in archive.namelist() if x.endswith('sit-008-results.json')]
            if len(names) != 1:
                raise ValueError('Expected one sit-008-results.json within ZIP.')
            info = archive.getinfo(names[0])
            if info.file_size > MAX_REPORT_BYTES:
                raise ValueError('Postman JSON report exceeds 5 MB.')
            data = archive.read(info)
    else:
        if path.stat().st_size > MAX_REPORT_BYTES:
            raise ValueError('Postman JSON report exceeds 5 MB.')
        data = path.read_bytes()
    return json.loads(data)


def body_json(execution):
    response = execution.get('response') or {}
    stream = response.get('stream') or {}
    if stream.get('type') != 'Buffer' or not isinstance(stream.get('data'), list):
        return None
    try:
        return json.loads(bytes(stream['data']).decode('utf-8'))
    except (ValueError, UnicodeDecodeError, TypeError):
        return None


def request_body(execution):
    raw = ((execution.get('requestExecuted') or {}).get('body') or {}).get('raw')
    if not isinstance(raw, str):
        return None
    try:
        return json.loads(raw)
    except ValueError:
        return None


def iso_ms(timestamp):
    return datetime.fromtimestamp(timestamp / 1000, tz=timezone.utc).isoformat().replace('+00:00','Z') if isinstance(timestamp, (float, int)) else None


def check(name, condition, evidence):
    return {'name': name, 'status': 'PASS' if condition else 'FAIL', 'evidence': evidence}


def normalize(doc):
    run = doc.get('run')
    if not isinstance(run, dict):
        raise ValueError('Expected Postman CLI run envelope.')
    meta = run.get('meta') or {}
    summary = run.get('summary') or {}
    executions = run.get('executions') or []
    if not isinstance(executions, list):
        raise ValueError('Expected executions array.')
    expected_methods = ['GET', 'POST', 'POST', 'GET']
    steps = []
    for idx, e in enumerate(executions):
        req = e.get('requestExecuted') or {}
        resp = e.get('response') or {}
        path = '/' + '/'.join((req.get('url') or {}).get('path', []))
        tests = e.get('tests') or []
        steps.append({
            'stepNumber': idx + 1,
            'request': {'name': req.get('name'), 'method': req.get('method'), 'path': path},
            'httpStatus': resp.get('code'),
            'responseTimeMs': resp.get('responseTime'),
            'assertions': [{'name': t.get('name'), 'status': t.get('status', '').upper()} for t in tests],
            'executionErrors': [str(err.get('message', err)) if isinstance(err, dict) else str(err) for err in e.get('errors') or []]
        })

    passed = sum(t['status'] == 'PASSED' for step in steps for t in step['assertions'])
    failed = sum(t['status'] != 'PASSED' for step in steps for t in step['assertions'])
    failures = failed + sum(len(s['executionErrors']) for s in steps)
    reported = summary.get('tests') or {}
    methods_match = len(steps) == 4 and [s['request']['method'] for s in steps] == expected_methods
    paths_match = (len(steps) == 4 and steps[0]['request']['path'] == '/products'
                   and steps[1]['request']['path'] == '/carts'
                   and steps[2]['request']['path'].startswith('/carts/')
                   and steps[3]['request']['path'].startswith('/carts/'))
    approved_origin_observed = (len(executions) == 4 and all(
        (e.get('requestExecuted') or {}).get('url',{}).get('host') == ['api', 'practicesoftwaretesting', 'com']
        and (e.get('requestExecuted') or {}).get('url',{}).get('protocol') == 'https'
        for e in executions))
    stats_consistent = reported.get('passed') == passed and reported.get('failed') == failed and reported.get('executed') == passed + failed

    business_checks = []
    bindings = {}
    if methods_match and paths_match and approved_origin_observed:
        first, second, third, fourth = executions
        products = body_json(first)
        created = body_json(second)
        added = request_body(third)
        cart = body_json(fourth)
        products_list = (products or {}).get('data') if isinstance(products, dict) else None
        product_id = (added or {}).get('product_id') if isinstance(added, dict) else None
        cart_id = (created or {}).get('id') if isinstance(created, dict) else None
        in_catalog = isinstance(products_list, list) and any(isinstance(p,dict) and p.get('id') == product_id for p in products_list)
        cart_post_path = steps[2]['request']['path']
        cart_get_path = steps[3]['request']['path']
        linked_paths = bool(cart_id) and cart_post_path.endswith('/' + str(cart_id)) and cart_get_path.endswith('/' + str(cart_id))
        matching_items = [(item or {}) for item in ((cart or {}).get('cart_items') or []) if isinstance(item,dict)] if isinstance(cart,dict) else []
        matching = any(item.get('product_id') == product_id and item.get('quantity') == 2 for item in matching_items)
        status_list = [s['httpStatus'] for s in steps]
        business_checks = [
            check('AC-01 Existing product selected', in_catalog and status_list[0] == 200, 'GET /products response.data[] and POST item product_id'),
            check('AC-02 Cart ID returned by creation', isinstance(cart_id,str) and bool(cart_id) and status_list[1] == 201, 'POST /carts response.id'),
            check('AC-03 Quantity 2 added to dynamic cart', linked_paths and isinstance(added,dict) and added.get('quantity') == 2 and status_list[2] == 200, 'POST /carts/{id} executed URL and JSON request body'),
            check('AC-04 Cart content independently observed', linked_paths and isinstance(cart,dict) and cart.get('id') == cart_id and matching and status_list[3] == 200, 'GET /carts/{cartId} response.cart_items[]'),
            {'name': 'AC-05 Documentation verification gap explicitly reported', 'status': 'NOT_ASSESSED', 'evidence': 'Requires comparison with frozen OpenAPI and approved design; execution JSON alone is insufficient'}
        ]
        bindings = {'productIdObserved': product_id, 'cartIdObserved': cart_id, 'quantityRequested': added.get('quantity') if isinstance(added,dict) else None}
    else:
        business_checks = [{'name':'REQ-CART-001 flow sequence', 'status':'NOT_ASSESSED', 'evidence':'Expected exactly GET products, POST carts, POST carts/{id}, GET carts/{cartId}'}]

    passed_business = sum(x['status'] == 'PASS' for x in business_checks)
    failed_business = sum(x['status'] == 'FAIL' for x in business_checks)
    all_pass = bool(stats_consistent and methods_match and paths_match and approved_origin_observed and failures == 0 and run.get('runError') is None and failed_business == 0 and passed_business == 4)
    return {
        'contractType': 'ALZAMO_POSTMAN_EVIDENCE',
        'schemaVersion': '0.1',
        'provenance': {'runner': 'Postman CLI', 'source': 'GitHub Actions uploaded JSON artifact', 'referenceTest': 'SIT-008', 'collectionName': meta.get('collectionName'), 'collectionId': meta.get('collectionId'), 'note': 'Static reference collection; not automatically generated from ALZAMO flowSteps'},
        'run': {'startedAt': iso_ms(meta.get('started')), 'completedAt': iso_ms(meta.get('completed')), 'durationMs': meta.get('duration'), 'runError': run.get('runError'), 'requestCount': len(steps), 'assertionCount': passed + failed, 'assertionsPassed': passed, 'assertionsFailed': failed, 'statisticsConsistent': stats_consistent, 'expectedRoutesObserved': paths_match, 'pstV5OriginObserved': approved_origin_observed, 'executionOutcome': 'PASS' if all_pass else 'REVIEW_REQUIRED'},
        'dynamicBindings': bindings,
        'steps': steps,
        'businessChecks': business_checks,
        'assessment': {'runtimeBusinessChecks': 'PASS' if all_pass else 'REVIEW_REQUIRED', 'documentationGapAssessment': 'NOT_ASSESSED', 'crossSystemIntegration': 'NOT_CLAIMED', 'alzamoDesignLinkVerified': False, 'finalStatus': 'EVIDENCE_COLLECTED' if all_pass else 'REVIEW_REQUIRED', 'limitations': ['AC-05 is a design/documentation check, not established by the Postman execution report.', 'No evidence of integration between independently deployed backend services.', 'Runner uses a pre-authored reference collection; automatic conversion from the AI design is not implemented.']}
    }


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('report', type=Path, help='Postman CLI JSON report or ZIP artifact')
    parser.add_argument('-o','--output',type=Path,default=Path('alzamo-sit-008-evidence.json'))
    args=parser.parse_args()
    normalized=normalize(load_report(args.report))
    args.output.write_text(json.dumps(normalized, ensure_ascii=False, indent=2)+'\n',encoding='utf8')
    print('Wrote',args.output,'—',normalized['run']['executionOutcome'],
          '('+str(normalized['run']['assertionsPassed'])+'/'+str(normalized['run']['assertionCount'])+' assertions passed)')

if __name__ == '__main__':
    main()
