  const fs = require('fs');
          const { chromium } = require('playwright');

          const storyKey = process.env.STORY_KEY;
          const executionId = process.env.EXECUTION_ID;
          const discoveryId = process.env.DISCOVERY_ID;
          const applicationName = process.env.APPLICATION_NAME;
          const targetUrl = process.env.TARGET_URL;
          const discoveryScope = process.env.DISCOVERY_SCOPE;
          const workflowRunId = process.env.WORKFLOW_RUN_ID;
          const workflowRunAttempt = process.env.WORKFLOW_RUN_ATTEMPT;
          const commitSha = process.env.COMMIT_SHA;

          const startedAt = new Date().toISOString();

          const cleanText = (value) =>
            String(value || '')
              .replace(/\s+/g, ' ')
              .trim();

          const uniqueStrings = (values) =>
            [...new Set(values.filter(Boolean))];

          async function runDiscovery() {
            let browser;

            try {
              browser = await chromium.launch({
                headless: true
              });

              const context = await browser.newContext({
                viewport: {
                  width: 1440,
                  height: 1000
                }
              });

              const page = await context.newPage();
              
              page.on('console', (message) => {
                console.log(
                  `[Browser console ${message.type()}] ${message.text()}`
                );
              });
              
              page.on('pageerror', (error) => {
                console.log(
                  `[Browser page error] ${error.message}`
                );
              });
              
              page.on('requestfailed', (request) => {
                console.log(
                  `[Request failed] ${request.method()} ${request.url()} - ` +
                  `${request.failure()?.errorText || 'Unknown error'}`
                );
              });
              
              page.on('response', (response) => {
                if (response.status() >= 400) {
                  console.log(
                    `[HTTP ${response.status()}] ${response.request().method()} ${response.url()}`
                  );
                }
              });
              
              await page.goto(targetUrl, {
              
              await page.goto(targetUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
              });

              await page.waitForLoadState('networkidle', {
                timeout: 30000
              }).catch(() => {
                console.log(
                  'Network did not become idle before timeout. Continuing discovery.'
                );
              });

             try {
                await page.locator('.card.skeleton').first().waitFor({
                  state: 'hidden',
                  timeout: 15000
                });
              } catch {
                console.log(
                  'Skeleton cards still present after timeout. Continuing discovery.'
                );
              }
              
              const productCards = page.locator('.card');
              const cardTitles = page.locator('.card-title');
              
              console.log(
                'Product cards found:',
                await productCards.count()
              );
              
              console.log(
                'Card titles found:',
                await cardTitles.count()
              );
              
              console.log(
                'First card title:',
                await cardTitles.first().textContent()
              );
              
              console.log(
                'First product card HTML:',
                await productCards.first().evaluate(
                  (element) => element.outerHTML
                )
              );
              
              await page.screenshot({
                path: 'homepage.png',
                fullPage: true
              });

              const pageData = await page.evaluate(() => {
                const normalizeText = (value) =>
                  String(value || '')
                    .replace(/\s+/g, ' ')
                    .trim();

                const isVisible = (element) => {
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

                const getElementSummary = (element) => ({
                  tagName: element.tagName.toLowerCase(),
                  text: normalizeText(
                    element.innerText ||
                    element.textContent ||
                    ''
                  ),
                  id: element.id || null,
                  className:
                    typeof element.className === 'string'
                      ? element.className
                      : null,
                  role: element.getAttribute('role'),
                  ariaLabel: element.getAttribute('aria-label'),
                  ariaLabelledBy:
                    element.getAttribute('aria-labelledby'),
                  dataTestId:
                    element.getAttribute('data-testid') ||
                    element.getAttribute('data-test') ||
                    element.getAttribute('data-cy'),
                  name: element.getAttribute('name'),
                  type: element.getAttribute('type'),
                  placeholder:
                    element.getAttribute('placeholder'),
                  href: element.getAttribute('href'),
                  title: element.getAttribute('title'),
                  visible: isVisible(element),
                  attributes: getAttributes(element)
                });

                const selectVisible = (selector) =>
                  [...document.querySelectorAll(selector)]
                    .filter(isVisible)
                    .map(getElementSummary);

                const allElements = [
                  ...document.querySelectorAll('*')
                ];

                const testIdElements = allElements
                  .filter((element) =>
                    element.hasAttribute('data-testid') ||
                    element.hasAttribute('data-test') ||
                    element.hasAttribute('data-cy')
                  )
                  .map(getElementSummary);

                const roleElements = allElements
                  .filter((element) =>
                    element.hasAttribute('role')
                  )
                  .map(getElementSummary);

                const forms = [
                  ...document.querySelectorAll('form')
                ].map((form) => ({
                  ...getElementSummary(form),
                  action: form.getAttribute('action'),
                  method: form.getAttribute('method'),
                  controls: [
                    ...form.querySelectorAll(
                      'input, select, textarea, button'
                    )
                  ].map(getElementSummary)
                }));

                return {
                  document: {
                    title: document.title,
                    url: window.location.href,
                    origin: window.location.origin,
                    pathname: window.location.pathname,
                    hash: window.location.hash,
                    language:
                      document.documentElement.lang || null
                  },

                  headings: selectVisible(
                    'h1, h2, h3, h4, h5, h6'
                  ),

                  links: selectVisible('a[href]'),

                  buttons: selectVisible(
                    'button, input[type="button"], input[type="submit"], [role="button"]'
                  ),

                  inputs: selectVisible(
                    'input, textarea, select'
                  ),

                  forms,

                  landmarks: selectVisible(
                    'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'
                  ),

                  images: selectVisible('img'),

                  tables: selectVisible(
                    'table, [role="table"], [role="grid"]'
                  ),

                  lists: selectVisible(
                    'ul, ol, [role="list"]'
                  ),

                  dialogs: selectVisible(
                    'dialog, [role="dialog"], [role="alertdialog"]'
                  ),

                  testIdElements,

                  explicitRoleElements: roleElements
                };
              });

              let accessibilitySnapshot = null;

                try {
                  accessibilitySnapshot =
                    await page.locator('body').ariaSnapshot();
                } catch (error) {
                  console.log(
                    `Accessibility snapshot unavailable: ${error.message}`
                  );
                }

              const dataTestIds = uniqueStrings(
                pageData.testIdElements.map(
                  (element) => element.dataTestId
                )
              );

              const explicitRoles = uniqueStrings(
                pageData.explicitRoleElements.map(
                  (element) => element.role
                )
              );

              const candidateSelectors = [];

              for (const element of pageData.testIdElements) {
                if (!element.dataTestId) {
                  continue;
                }

                candidateSelectors.push({
                  strategy: 'test-id',
                  selector: `[data-testid="${element.dataTestId}"]`,
                  value: element.dataTestId,
                  tagName: element.tagName,
                  text: element.text,
                  confidence: 1
                });
              }

              for (const button of pageData.buttons) {
                if (button.dataTestId) {
                  continue;
                }

                if (button.role && button.ariaLabel) {
                  candidateSelectors.push({
                    strategy: 'accessible-role',
                    selector:
                      `getByRole('${button.role}', { name: '${button.ariaLabel}' })`,
                    role: button.role,
                    accessibleName: button.ariaLabel,
                    tagName: button.tagName,
                    confidence: 0.95
                  });

                  continue;
                }

                if (button.text) {
                  candidateSelectors.push({
                    strategy: 'button-name',
                    selector:
                      `getByRole('button', { name: '${cleanText(button.text)}' })`,
                    role: 'button',
                    accessibleName: cleanText(button.text),
                    tagName: button.tagName,
                    confidence: 0.9
                  });
                }
              }

              for (const input of pageData.inputs) {
                if (input.dataTestId) {
                  continue;
                }

                if (input.ariaLabel) {
                  candidateSelectors.push({
                    strategy: 'label',
                    selector:
                      `getByLabel('${cleanText(input.ariaLabel)}')`,
                    accessibleName:
                      cleanText(input.ariaLabel),
                    tagName: input.tagName,
                    confidence: 0.95
                  });

                  continue;
                }

                if (input.placeholder) {
                  candidateSelectors.push({
                    strategy: 'placeholder',
                    selector:
                      `getByPlaceholder('${cleanText(input.placeholder)}')`,
                    placeholder:
                      cleanText(input.placeholder),
                    tagName: input.tagName,
                    confidence: 0.85
                  });
                }
              }

              const completedAt = new Date().toISOString();

              const selectorLibrary = {
                schemaVersion: '1.0',
              
                storyKey,
                executionId,
                discoveryId,
              
                application: {
                  name: applicationName,
                  pageTitle: pageData.document.title,
                  pageUrl: pageData.document.url
                },
              
                generatedAt: completedAt,
              
                selectors: candidateSelectors
                  .filter((candidate) => candidate.confidence >= 0.85)
                  .map((candidate) => ({
                    name:
                      candidate.value ||
                      candidate.accessibleName ||
                      candidate.placeholder ||
                      candidate.selector,
              
                    strategy: candidate.strategy,
                    selector: candidate.selector,
                    tagName: candidate.tagName || null,
                    text: candidate.text || null,
                    accessibleName:
                      candidate.accessibleName || null,
                    confidence: candidate.confidence
                  })),
              
                testIds: pageData.testIdElements
                  .filter((element) => element.dataTestId)
                  .map((element) => ({
                    name: element.dataTestId,
                    selector:
                      `[data-testid="${element.dataTestId}"]`,
                    tagName: element.tagName,
                    text: element.text || null,
                    role: element.role || null,
                    visible: element.visible
                  })),
              
                summary: {
                  selectorCount: candidateSelectors.filter(
                    (candidate) => candidate.confidence >= 0.85
                  ).length,
              
                  testIdSelectorCount:
                    pageData.testIdElements.filter(
                      (element) => element.dataTestId
                    ).length
                }
              };
              
              fs.writeFileSync(
                'selector-library.json',
                JSON.stringify(selectorLibrary, null, 2)
              );

              const discoveryResult = {
                schemaVersion: '1.0',

                storyKey,
                executionId,
                discoveryId,

                application: {
                  name: applicationName,
                  requestedUrl: targetUrl,
                  discoveredUrl: pageData.document.url
                },

                discovery: {
                  scope: discoveryScope,
                  status: 'COMPLETED',
                  startedAt,
                  completedAt
                },

                page: pageData.document,

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
                  dataTestIdCount: dataTestIds.length,
                  explicitRoleCount: explicitRoles.length,
                  candidateSelectorCount:
                    candidateSelectors.length
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

                selectorDiscovery: {
                  dataTestIds,
                  explicitRoles,
                  candidates: candidateSelectors
                },

                accessibility: {
                  snapshot: accessibilitySnapshot
                },

                artifacts: {
                  screenshot: 'homepage.png',
                  discoveryJson:
                    'application-discovery.json'
                },

                github: {
                  workflowRunId,
                  workflowRunAttempt,
                  commitSha
                }
              };

              fs.writeFileSync(
                'application-discovery.json',
                JSON.stringify(discoveryResult, null, 2)
              );

              console.log(
                JSON.stringify(discoveryResult.summary, null, 2)
              );

              await context.close();
            } catch (error) {
              const failedAt = new Date().toISOString();

              const failureResult = {
                schemaVersion: '1.0',

                storyKey,
                executionId,
                discoveryId,

                application: {
                  name: applicationName,
                  requestedUrl: targetUrl
                },

                discovery: {
                  scope: discoveryScope,
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

              fs.writeFileSync(
                'application-discovery.json',
                JSON.stringify(failureResult, null, 2)
              );

              console.error(error);
              process.exitCode = 1;
            } finally {
              if (browser) {
                await browser.close();
              }
            }
          }

          runDiscovery();
