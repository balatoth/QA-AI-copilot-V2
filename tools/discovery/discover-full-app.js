const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const storyKey = process.env.STORY_KEY;
const executionId = process.env.EXECUTION_ID;
const discoveryId = process.env.DISCOVERY_ID;
const applicationName = process.env.APPLICATION_NAME;
const environmentId = process.env.ENVIRONMENT_ID || 'hosted-sprint-2';
const targetUrl = process.env.TARGET_URL;
const discoveryScope = 'FULL_APP';
const workflowRunId = process.env.WORKFLOW_RUN_ID;
const workflowRunAttempt = process.env.WORKFLOW_RUN_ATTEMPT;
const commitSha = process.env.COMMIT_SHA;
const maxPages = Number.parseInt(process.env.MAX_PAGES || '20', 10);
const maxDepth = Number.parseInt(process.env.MAX_DEPTH || '3', 10);
const startedAt = new Date().toISOString();

const REQUIRED_ENVIRONMENT_ID = 'hosted-sprint-2';
const REQUIRED_ORIGIN = 'https://v2.practicesoftwaretesting.com';

function assertRequired(value, name) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

function uniqueBy(values, keyFn) {
  const seen = new Set();
  const result = [];

  for (const value of values) {
    const key = keyFn(value);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(value);
  }

  return result;
}

function escapeSelectorValue(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

function safeSlug(value) {
  return String(value || 'page')
    .toLowerCase()
    .replace(/^#\/?/, '')
    .replace(/^\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'home';
}

function parseSeedRoutes(rawValue) {
  if (!rawValue) {
    return ['#/', '#/contact', '#/category/hand-tools', '#/category/power-tools', '#/product/1'];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return parsed.map(String).filter(Boolean);
    }
  } catch (_) {
    // Fall through to comma-separated parsing.
  }

  return rawValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function resolveSeedUrl(seed, baseUrl) {
  if (/^https?:\/\//i.test(seed)) {
    return new URL(seed).toString();
  }

  const base = new URL(baseUrl);

  if (seed.startsWith('#')) {
    base.hash = seed.slice(1);
    return base.toString();
  }

  return new URL(seed, base).toString();
}

function normalizeRoutePattern(urlValue) {
  const url = new URL(urlValue);
  const normalizedPath = url.pathname
    .replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, ':id')
    .replace(/\/(\d+)(?=\/|$)/g, '/:id');

  const normalizedHash = (url.hash || '#/')
    .replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, ':id')
    .replace(/\/(\d+)(?=\/|$|\?)/g, '/:id')
    .replace(/\?.*$/, '');

  return `${url.origin}${normalizedPath}${normalizedHash}`;
}

function isSafeInternalUrl(candidateUrl, allowedOrigin) {
  let url;

  try {
    url = new URL(candidateUrl);
  } catch (_) {
    return false;
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return false;
  }

  if (url.origin !== allowedOrigin) {
    return false;
  }

  const route = `${url.pathname}${url.hash}`.toLowerCase();
  const blockedFragments = [
    'logout',
    'signout',
    'delete',
    'destroy',
    'remove-account',
    'payment',
    'checkout',
    '/admin'
  ];

  return !blockedFragments.some((fragment) => route.includes(fragment));
}

function createPageId(urlValue, routePattern, index) {
  const url = new URL(urlValue);
  const routeValue = url.hash || url.pathname || routePattern;
  return `${String(index + 1).padStart(2, '0')}-${safeSlug(routeValue)}`;
}

function buildSelectorCandidates(pageData, pageMeta) {
  const candidates = [];

  for (const element of pageData.testIdElements) {
    if (!element.dataTestId || !element.dataTestAttribute) {
      continue;
    }

    candidates.push({
      name: element.dataTestId,
      strategy: 'test-id',
      selector: `[${element.dataTestAttribute}="${escapeSelectorValue(element.dataTestId)}"]`,
      attribute: element.dataTestAttribute,
      tagName: element.tagName,
      text: element.text || null,
      accessibleName: element.ariaLabel || element.labelText || null,
      confidence: 1,
      pageId: pageMeta.pageId,
      pageUrl: pageMeta.pageUrl,
      routePattern: pageMeta.routePattern
    });
  }

  for (const button of pageData.buttons) {
    if (button.dataTestId) {
      continue;
    }

    const accessibleName = cleanText(button.ariaLabel || button.text);
    if (!accessibleName) {
      continue;
    }

    candidates.push({
      name: accessibleName,
      strategy: 'accessible-role',
      selector: `getByRole('button', { name: '${accessibleName.replace(/'/g, "\\'")}' })`,
      attribute: null,
      tagName: button.tagName,
      text: button.text || null,
      accessibleName,
      confidence: 0.9,
      pageId: pageMeta.pageId,
      pageUrl: pageMeta.pageUrl,
      routePattern: pageMeta.routePattern
    });
  }

  for (const input of pageData.inputs) {
    if (input.dataTestId) {
      continue;
    }

    const label = cleanText(input.ariaLabel || input.labelText);
    const placeholder = cleanText(input.placeholder);
    const name = cleanText(input.name);

    if (label) {
      candidates.push({
        name: label,
        strategy: 'label',
        selector: `getByLabel('${label.replace(/'/g, "\\'")}')`,
        attribute: null,
        tagName: input.tagName,
        text: null,
        accessibleName: label,
        confidence: 0.95,
        pageId: pageMeta.pageId,
        pageUrl: pageMeta.pageUrl,
        routePattern: pageMeta.routePattern
      });
    } else if (placeholder) {
      candidates.push({
        name: placeholder,
        strategy: 'placeholder',
        selector: `getByPlaceholder('${placeholder.replace(/'/g, "\\'")}')`,
        attribute: null,
        tagName: input.tagName,
        text: null,
        accessibleName: null,
        confidence: 0.85,
        pageId: pageMeta.pageId,
        pageUrl: pageMeta.pageUrl,
        routePattern: pageMeta.routePattern
      });
    } else if (name) {
      candidates.push({
        name,
        strategy: 'name-attribute',
        selector: `[name="${escapeSelectorValue(name)}"]`,
        attribute: 'name',
        tagName: input.tagName,
        text: null,
        accessibleName: null,
        confidence: 0.85,
        pageId: pageMeta.pageId,
        pageUrl: pageMeta.pageUrl,
        routePattern: pageMeta.routePattern
      });
    }
  }

  for (const link of pageData.links) {
    if (link.dataTestId || !link.text) {
      continue;
    }

    const accessibleName = cleanText(link.text);
    if (!accessibleName || accessibleName.length > 100) {
      continue;
    }

    candidates.push({
      name: accessibleName,
      strategy: 'accessible-role',
      selector: `getByRole('link', { name: '${accessibleName.replace(/'/g, "\\'")}' })`,
      attribute: null,
      tagName: link.tagName,
      text: link.text,
      accessibleName,
      confidence: 0.88,
      pageId: pageMeta.pageId,
      pageUrl: pageMeta.pageUrl,
      routePattern: pageMeta.routePattern
    });
  }

  return uniqueBy(
    candidates.filter((candidate) => candidate.confidence >= 0.85),
    (candidate) => `${candidate.routePattern}|${candidate.selector}`
  );
}

async function inspectPage(page, requestedUrl, pageId, routePattern) {
  await page.goto(requestedUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1500);

  const pageData = await page.evaluate(() => {
    const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

    const isVisible = (element) => {
      if (!(element instanceof Element)) {
        return false;
      }

      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number(style.opacity) !== 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const getAttributes = (element) => {
      const attributes = {};
      for (const attribute of element.attributes || []) {
        attributes[attribute.name] = attribute.value;
      }
      return attributes;
    };

    const getTestIdentifier = (element) => {
      for (const attribute of ['data-testid', 'data-test', 'data-cy']) {
        if (element.hasAttribute(attribute)) {
          return {
            attribute,
            value: element.getAttribute(attribute)
          };
        }
      }

      return { attribute: null, value: null };
    };

    const findLabelText = (element) => {
      const id = element.getAttribute('id');
      if (id) {
        const explicitLabel = document.querySelector(`label[for="${CSS.escape(id)}"]`);
        if (explicitLabel) {
          return normalizeText(explicitLabel.innerText || explicitLabel.textContent);
        }
      }

      const parentLabel = element.closest('label');
      if (parentLabel) {
        return normalizeText(parentLabel.innerText || parentLabel.textContent);
      }

      const ariaLabelledBy = element.getAttribute('aria-labelledby');
      if (ariaLabelledBy) {
        return ariaLabelledBy
          .split(/\s+/)
          .map((labelId) => document.getElementById(labelId))
          .filter(Boolean)
          .map((labelElement) => normalizeText(labelElement.innerText || labelElement.textContent))
          .filter(Boolean)
          .join(' ');
      }

      return null;
    };

    const summarizeElement = (element) => {
      const testIdentifier = getTestIdentifier(element);
      const optionValues = element.tagName.toLowerCase() === 'select'
        ? [...element.options].map((option) => ({
            value: option.value,
            text: normalizeText(option.textContent),
            disabled: option.disabled
          }))
        : [];

      return {
        tagName: element.tagName.toLowerCase(),
        text: normalizeText(element.innerText || element.textContent || ''),
        id: element.id || null,
        className: typeof element.className === 'string' ? element.className : null,
        role: element.getAttribute('role'),
        ariaLabel: element.getAttribute('aria-label'),
        ariaLabelledBy: element.getAttribute('aria-labelledby'),
        labelText: findLabelText(element),
        dataTestId: testIdentifier.value,
        dataTestAttribute: testIdentifier.attribute,
        name: element.getAttribute('name'),
        type: element.getAttribute('type'),
        placeholder: element.getAttribute('placeholder'),
        href: element.getAttribute('href'),
        title: element.getAttribute('title'),
        required: element.hasAttribute('required'),
        disabled: element.hasAttribute('disabled'),
        readOnly: element.hasAttribute('readonly'),
        minLength: element.getAttribute('minlength'),
        maxLength: element.getAttribute('maxlength'),
        min: element.getAttribute('min'),
        max: element.getAttribute('max'),
        pattern: element.getAttribute('pattern'),
        optionValues,
        visible: isVisible(element),
        attributes: getAttributes(element)
      };
    };

    const selectVisible = (selector) => [...document.querySelectorAll(selector)]
      .filter(isVisible)
      .map(summarizeElement);

    const allElements = [...document.querySelectorAll('*')];
    const testIdElements = allElements
      .filter((element) => ['data-testid', 'data-test', 'data-cy'].some((attribute) => element.hasAttribute(attribute)))
      .map(summarizeElement);

    const explicitRoleElements = allElements
      .filter((element) => element.hasAttribute('role'))
      .map(summarizeElement);

    const forms = [...document.querySelectorAll('form')]
      .filter(isVisible)
      .map((form, formIndex) => ({
        formIndex,
        ...summarizeElement(form),
        action: form.getAttribute('action'),
        method: form.getAttribute('method'),
        controls: [...form.querySelectorAll('input, select, textarea, button')]
          .filter(isVisible)
          .map(summarizeElement)
      }));

    const productRoots = [...document.querySelectorAll(
      '[data-test^="product-"]:not([data-test="product-name"]):not([data-test="product-price"]), ' +
      '[data-testid*="product-card"], .product-card'
    )]
      .filter(isVisible);

    const productCards = [];
    const seenRoots = new Set();

    for (const matchedElement of productRoots) {
      const root = matchedElement.closest('li, article, .card') || matchedElement;
      if (seenRoots.has(root)) {
        continue;
      }
      seenRoots.add(root);

      const rootSummary = summarizeElement(root);
      const clickable = root.matches('a[href], button, [role="button"]')
        ? root
        : root.querySelector('a[href], button, [role="button"]');
      const titleElement = root.querySelector('[data-test="product-name"], [data-testid="product-name"], .product-name, .card-title, h2, h3, h4');
      const priceElement = root.querySelector('[data-test="product-price"], [data-testid="product-price"], .product-price, .price');
      const imageElement = root.querySelector('img');

      if (!clickable && !titleElement) {
        continue;
      }

      productCards.push({
        index: productCards.length,
        type: 'PRODUCT_CARD',
        container: rootSummary,
        root: clickable ? summarizeElement(clickable) : rootSummary,
        title: titleElement ? summarizeElement(titleElement) : null,
        price: priceElement ? summarizeElement(priceElement) : null,
        image: imageElement ? summarizeElement(imageElement) : null,
        link: clickable && clickable.tagName.toLowerCase() === 'a'
          ? summarizeElement(clickable)
          : null
      });
    }

    return {
      document: {
        title: document.title,
        url: window.location.href,
        origin: window.location.origin,
        pathname: window.location.pathname,
        hash: window.location.hash,
        language: document.documentElement.lang || null
      },
      headings: selectVisible('h1, h2, h3, h4, h5, h6'),
      links: selectVisible('a[href]'),
      buttons: selectVisible('button, input[type="button"], input[type="submit"], [role="button"]'),
      inputs: selectVisible('input, textarea, select'),
      forms,
      landmarks: selectVisible('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'),
      images: selectVisible('img'),
      tables: selectVisible('table, [role="table"], [role="grid"]'),
      lists: selectVisible('ul, ol, [role="list"]'),
      dialogs: selectVisible('dialog, [role="dialog"], [role="alertdialog"], [role="alert"]'),
      testIdElements,
      explicitRoleElements,
      productCards
    };
  });

  let accessibilitySnapshot = null;
  try {
    accessibilitySnapshot = await page.locator('body').ariaSnapshot();
  } catch (error) {
    accessibilitySnapshot = `Accessibility snapshot unavailable: ${error.message}`;
  }

  const finalUrl = pageData.document.url;
  const pageMeta = {
    pageId,
    requestedUrl,
    pageUrl: finalUrl,
    routePattern,
    title: pageData.document.title
  };

  const selectors = buildSelectorCandidates(pageData, pageMeta);
  const screenshotPath = path.join('screenshots', `${pageId}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const discoveredLinks = pageData.links
    .map((link) => link.href)
    .filter(Boolean)
    .map((href) => {
      try {
        return new URL(href, finalUrl).toString();
      } catch (_) {
        return null;
      }
    })
    .filter(Boolean);

  return {
    ...pageMeta,
    document: pageData.document,
    summary: {
      headingCount: pageData.headings.length,
      linkCount: pageData.links.length,
      buttonCount: pageData.buttons.length,
      inputCount: pageData.inputs.length,
      formCount: pageData.forms.length,
      landmarkCount: pageData.landmarks.length,
      imageCount: pageData.images.length,
      tableCount: pageData.tables.length,
      listCount: pageData.lists.length,
      dialogCount: pageData.dialogs.length,
      dataTestIdCount: pageData.testIdElements.length,
      explicitRoleCount: pageData.explicitRoleElements.length,
      acceptedSelectorCount: selectors.length,
      productCardCount: pageData.productCards.length
    },
    elements: {
      headings: pageData.headings,
      links: pageData.links,
      buttons: pageData.buttons,
      inputs: pageData.inputs,
      forms: pageData.forms,
      landmarks: pageData.landmarks,
      images: pageData.images,
      tables: pageData.tables,
      lists: pageData.lists,
      dialogs: pageData.dialogs
    },
    components: {
      productCards: pageData.productCards
    },
    selectorDiscovery: {
      dataTestIds: uniqueStrings(pageData.testIdElements.map((element) => element.dataTestId)),
      explicitRoles: uniqueStrings(pageData.explicitRoleElements.map((element) => element.role)),
      candidates: selectors,
      acceptedCandidates: selectors
    },
    accessibility: {
      snapshot: accessibilitySnapshot
    },
    artifacts: {
      screenshot: screenshotPath,
      pageJson: `pages/${pageId}.json`
    },
    discoveredLinks
  };
}

async function runDiscovery() {
  let browser;

  try {
    for (const [value, name] of [
      [storyKey, 'STORY_KEY'],
      [executionId, 'EXECUTION_ID'],
      [discoveryId, 'DISCOVERY_ID'],
      [applicationName, 'APPLICATION_NAME'],
      [targetUrl, 'TARGET_URL']
    ]) {
      assertRequired(value, name);
    }

    if (environmentId !== REQUIRED_ENVIRONMENT_ID) {
      throw new Error(
        `FULL_APP discovery is restricted to ${REQUIRED_ENVIRONMENT_ID}; received ${environmentId}`
      );
    }

    const targetOrigin = new URL(targetUrl).origin;
    if (targetOrigin !== REQUIRED_ORIGIN) {
      throw new Error(
        `FULL_APP discovery is restricted to ${REQUIRED_ORIGIN}; received ${targetOrigin}`
      );
    }

    fs.mkdirSync('pages', { recursive: true });
    fs.mkdirSync('screenshots', { recursive: true });

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      ignoreHTTPSErrors: false
    });
    const page = await context.newPage();

    const seedRoutes = parseSeedRoutes(process.env.SEED_ROUTES);
    const queue = [];
    const queuedPatterns = new Set();
    const visitedPatterns = new Set();

    for (const seed of seedRoutes) {
      const resolvedUrl = resolveSeedUrl(seed, targetUrl);
      if (!isSafeInternalUrl(resolvedUrl, targetOrigin)) {
        continue;
      }
      const routePattern = normalizeRoutePattern(resolvedUrl);
      if (!queuedPatterns.has(routePattern)) {
        queue.push({ url: resolvedUrl, depth: 0, source: 'SEED' });
        queuedPatterns.add(routePattern);
      }
    }

    const targetPattern = normalizeRoutePattern(targetUrl);
    if (!queuedPatterns.has(targetPattern)) {
      queue.unshift({ url: targetUrl, depth: 0, source: 'TARGET' });
      queuedPatterns.add(targetPattern);
    }

    const pages = [];
    const failures = [];

    while (queue.length > 0 && pages.length < maxPages) {
      const current = queue.shift();
      const routePattern = normalizeRoutePattern(current.url);

      if (visitedPatterns.has(routePattern)) {
        continue;
      }
      visitedPatterns.add(routePattern);

      const pageId = createPageId(current.url, routePattern, pages.length);
      console.log(`Discovering ${current.url} as ${pageId}`);

      try {
        const pageResult = await inspectPage(page, current.url, pageId, routePattern);
        pages.push({
          ...pageResult,
          depth: current.depth,
          source: current.source
        });

        const pageJson = { ...pageResult };
        delete pageJson.discoveredLinks;
        fs.writeFileSync(
          path.join('pages', `${pageId}.json`),
          JSON.stringify(pageJson, null, 2)
        );

        if (current.depth < maxDepth) {
          for (const discoveredUrl of pageResult.discoveredLinks) {
            if (!isSafeInternalUrl(discoveredUrl, targetOrigin)) {
              continue;
            }

            const discoveredPattern = normalizeRoutePattern(discoveredUrl);
            if (visitedPatterns.has(discoveredPattern) || queuedPatterns.has(discoveredPattern)) {
              continue;
            }

            queue.push({
              url: discoveredUrl,
              depth: current.depth + 1,
              source: pageId
            });
            queuedPatterns.add(discoveredPattern);
          }
        }
      } catch (error) {
        failures.push({
          requestedUrl: current.url,
          routePattern,
          depth: current.depth,
          error: {
            name: error.name,
            message: error.message
          }
        });
        console.error(`Discovery failed for ${current.url}: ${error.message}`);
      }
    }

    if (pages.length === 0) {
      throw new Error('FULL_APP discovery did not successfully inspect any pages');
    }

    const completedAt = new Date().toISOString();
    const mergedSelectors = uniqueBy(
      pages.flatMap((pageResult) => pageResult.selectorDiscovery.acceptedCandidates),
      (selector) => `${selector.routePattern}|${selector.selector}`
    );
    const mergedTestIds = uniqueBy(
      mergedSelectors
        .filter((selector) => selector.strategy === 'test-id')
        .map((selector) => ({
          name: selector.name,
          attribute: selector.attribute,
          selector: selector.selector,
          tagName: selector.tagName,
          text: selector.text || null,
          role: null,
          visible: true,
          pageId: selector.pageId,
          pageUrl: selector.pageUrl,
          routePattern: selector.routePattern
        })),
      (testId) => `${testId.routePattern}|${testId.selector}`
    );
    const mergedProductCards = pages.flatMap((pageResult) =>
      pageResult.components.productCards.map((component) => ({
        ...component,
        pageId: pageResult.pageId,
        pageUrl: pageResult.pageUrl,
        routePattern: pageResult.routePattern
      }))
    );

    const routeMap = {
      schemaVersion: '1.0',
      artifactType: 'APPLICATION_ROUTE_MAP',
      application: {
        name: applicationName,
        environmentId,
        origin: targetOrigin
      },
      discoveryId,
      generatedAt: completedAt,
      routes: pages.map((pageResult) => ({
        pageId: pageResult.pageId,
        requestedUrl: pageResult.requestedUrl,
        pageUrl: pageResult.pageUrl,
        routePattern: pageResult.routePattern,
        title: pageResult.title,
        depth: pageResult.depth,
        source: pageResult.source,
        summary: pageResult.summary
      })),
      failures
    };

    fs.writeFileSync('route-map.json', JSON.stringify(routeMap, null, 2));

    const selectorLibrary = {
      schemaVersion: '1.2',
      artifactType: 'SELECTOR_LIBRARY',
      storyKey,
      executionId,
      discoveryId,
      application: {
        name: applicationName,
        environmentId,
        origin: targetOrigin,
        pageTitle: pages[0].title,
        pageUrl: pages[0].pageUrl
      },
      discovery: {
        scope: discoveryScope,
        strategy: 'BOUNDED_ROUTE_CRAWL'
      },
      generatedAt: completedAt,
      routes: routeMap.routes,
      selectors: mergedSelectors,
      testIds: mergedTestIds,
      components: mergedProductCards,
      componentTypes: {
        PRODUCT_CARD: {
          count: mergedProductCards.length,
          relationshipModel: 'PAGE_SCOPED_COMPONENTS'
        }
      },
      pages: pages.map((pageResult) => ({
        pageId: pageResult.pageId,
        pageUrl: pageResult.pageUrl,
        routePattern: pageResult.routePattern,
        title: pageResult.title,
        selectors: pageResult.selectorDiscovery.acceptedCandidates,
        forms: pageResult.elements.forms,
        productCards: pageResult.components.productCards
      })),
      summary: {
        pageCount: pages.length,
        routePatternCount: uniqueStrings(pages.map((pageResult) => pageResult.routePattern)).length,
        selectorCount: mergedSelectors.length,
        testIdSelectorCount: mergedTestIds.length,
        componentCount: mergedProductCards.length,
        productCardCount: mergedProductCards.length,
        formCount: pages.reduce((sum, pageResult) => sum + pageResult.summary.formCount, 0),
        inputCount: pages.reduce((sum, pageResult) => sum + pageResult.summary.inputCount, 0),
        failureCount: failures.length
      }
    };

    fs.writeFileSync('selector-library.json', JSON.stringify(selectorLibrary, null, 2));

    const rootPage = pages[0];
    const discoveryResult = {
      schemaVersion: '1.2',
      artifactType: 'APPLICATION_DISCOVERY',
      storyKey,
      executionId,
      discoveryId,
      application: {
        name: applicationName,
        environmentId,
        requestedUrl: targetUrl,
        discoveredUrl: rootPage.pageUrl,
        origin: targetOrigin
      },
      discovery: {
        scope: discoveryScope,
        strategy: 'BOUNDED_ROUTE_CRAWL',
        status: failures.length === pages.length ? 'FAILED' : 'COMPLETED',
        startedAt,
        completedAt,
        maxPages,
        maxDepth,
        sameOriginOnly: true,
        destructiveActionsAllowed: false,
        formSubmissionAllowed: false
      },
      page: rootPage.document,
      routeMap: {
        path: 'route-map.json',
        pageCount: pages.length,
        routes: routeMap.routes,
        failures
      },
      pages: pages.map((pageResult) => {
        const copy = { ...pageResult };
        delete copy.discoveredLinks;
        return copy;
      }),
      summary: selectorLibrary.summary,
      elements: {
        headings: pages.flatMap((pageResult) => pageResult.elements.headings.map((element) => ({
          ...element,
          pageId: pageResult.pageId,
          pageUrl: pageResult.pageUrl,
          routePattern: pageResult.routePattern
        }))),
        links: pages.flatMap((pageResult) => pageResult.elements.links.map((element) => ({
          ...element,
          pageId: pageResult.pageId,
          pageUrl: pageResult.pageUrl,
          routePattern: pageResult.routePattern
        }))),
        buttons: pages.flatMap((pageResult) => pageResult.elements.buttons.map((element) => ({
          ...element,
          pageId: pageResult.pageId,
          pageUrl: pageResult.pageUrl,
          routePattern: pageResult.routePattern
        }))),
        inputs: pages.flatMap((pageResult) => pageResult.elements.inputs.map((element) => ({
          ...element,
          pageId: pageResult.pageId,
          pageUrl: pageResult.pageUrl,
          routePattern: pageResult.routePattern
        }))),
        forms: pages.flatMap((pageResult) => pageResult.elements.forms.map((element) => ({
          ...element,
          pageId: pageResult.pageId,
          pageUrl: pageResult.pageUrl,
          routePattern: pageResult.routePattern
        }))),
        dialogs: pages.flatMap((pageResult) => pageResult.elements.dialogs.map((element) => ({
          ...element,
          pageId: pageResult.pageId,
          pageUrl: pageResult.pageUrl,
          routePattern: pageResult.routePattern
        })))
      },
      components: {
        productCards: mergedProductCards
      },
      selectorDiscovery: {
        dataTestIds: uniqueStrings(mergedTestIds.map((testId) => testId.name)),
        explicitRoles: uniqueStrings(pages.flatMap((pageResult) => pageResult.selectorDiscovery.explicitRoles)),
        candidates: mergedSelectors,
        acceptedCandidates: mergedSelectors
      },
      accessibility: {
        pages: pages.map((pageResult) => ({
          pageId: pageResult.pageId,
          pageUrl: pageResult.pageUrl,
          routePattern: pageResult.routePattern,
          snapshot: pageResult.accessibility.snapshot
        }))
      },
      artifacts: {
        discoveryJson: 'application-discovery.json',
        selectorLibrary: 'selector-library.json',
        routeMap: 'route-map.json',
        pagesDirectory: 'pages',
        screenshotsDirectory: 'screenshots'
      },
      github: {
        workflowRunId,
        workflowRunAttempt,
        commitSha
      }
    };

    fs.writeFileSync('application-discovery.json', JSON.stringify(discoveryResult, null, 2));

    console.log(JSON.stringify(discoveryResult.summary, null, 2));
    await context.close();
  } catch (error) {
    const failedAt = new Date().toISOString();
    const failureResult = {
      schemaVersion: '1.2',
      artifactType: 'APPLICATION_DISCOVERY',
      storyKey,
      executionId,
      discoveryId,
      application: {
        name: applicationName,
        environmentId,
        requestedUrl: targetUrl
      },
      discovery: {
        scope: discoveryScope,
        strategy: 'BOUNDED_ROUTE_CRAWL',
        status: 'FAILED',
        startedAt,
        completedAt: failedAt
      },
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      github: {
        workflowRunId,
        workflowRunAttempt,
        commitSha
      }
    };

    fs.writeFileSync('application-discovery.json', JSON.stringify(failureResult, null, 2));
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runDiscovery();
