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

const escapeSelectorValue = (value) =>
  String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

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

    await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await page
      .waitForLoadState('networkidle', {
        timeout: 30000
      })
      .catch(() => {
        console.log(
          'Network did not become idle before timeout. Continuing discovery.'
        );
      });

    await page.waitForTimeout(3000);

    await page.screenshot({
      path: 'homepage.png',
      fullPage: true
    });

    const pageData = await page.evaluate(() => {
      const normalizeText = (value) =>
        String(value || '')
          .replace(/\s+/g, ' ')
          .trim();

      const escapeSelectorValue = (value) =>
        String(value || '')
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"');

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
        if (element.hasAttribute('data-testid')) {
          return {
            attribute: 'data-testid',
            value: element.getAttribute('data-testid')
          };
        }

        if (element.hasAttribute('data-test')) {
          return {
            attribute: 'data-test',
            value: element.getAttribute('data-test')
          };
        }

        if (element.hasAttribute('data-cy')) {
          return {
            attribute: 'data-cy',
            value: element.getAttribute('data-cy')
          };
        }

        return {
          attribute: null,
          value: null
        };
      };

      const buildAttributeSelector = (attribute, value) => {
        if (!attribute || !value) {
          return null;
        }

        return `[${attribute}="${escapeSelectorValue(value)}"]`;
      };

      const getElementSummary = (element) => {
        const testIdentifier = getTestIdentifier(element);

        return {
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

          dataTestId: testIdentifier.value,

          dataTestAttribute:
            testIdentifier.attribute,

          testIdSelector: buildAttributeSelector(
            testIdentifier.attribute,
            testIdentifier.value
          ),

          name: element.getAttribute('name'),

          type: element.getAttribute('type'),

          placeholder:
            element.getAttribute('placeholder'),

          href: element.getAttribute('href'),

          title: element.getAttribute('title'),

          visible: isVisible(element),

          attributes: getAttributes(element)
        };
      };

      const selectVisible = (selector) =>
        [...document.querySelectorAll(selector)]
          .filter(isVisible)
          .map(getElementSummary);

      const allElements = [
        ...document.querySelectorAll('*')
      ];

      const testIdElements = allElements
        .filter(
          (element) =>
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

      /*
       * Minimal multi-strategy product discovery. Strategies are tried in
       * order and discovery stops at the first one that yields validated,
       * uniquely addressable product cards.
       */
      const productDiscoveryStrategies = [
        {
          selector: '[data-test^="product-"]',
          confidence: 1
        },
        {
          selector: '[data-testid^="product"]',
          confidence: 0.98
        },
        {
          selector: '[data-test*="product-card"]',
          confidence: 0.95
        },
        {
          selector: '.product-card',
          confidence: 0.9
        },
        {
          selector: '.card',
          confidence: 0.85
        }
      ];

      const findProductParts = (element) => {
        const nameSelectors = [
          '[data-test="product-name"]',
          '[data-testid="product-name"]',
          '.product-name',
          '.card-title',
          'h2',
          'h3',
          'h4'
        ];
        const priceSelectors = [
          '[data-test="product-price"]',
          '[data-testid="product-price"]',
          '.product-price',
          '.price'
        ];
        const nameSelector = nameSelectors.find(
          (selector) => element.querySelector(selector)
        );
        const priceSelector = priceSelectors.find(
          (selector) => element.querySelector(selector)
        );
        const nameElement = nameSelector
          ? element.querySelector(nameSelector)
          : null;
        const priceElement = priceSelector
          ? element.querySelector(priceSelector)
          : null;
        const imageElement = element.querySelector('img');
        const linkElement = element.matches('a[href]')
          ? element
          : element.querySelector('a[href]');

        const evidenceCount = [
          imageElement,
          nameElement,
          priceElement,
          linkElement
        ].filter(Boolean).length;

        return {
          nameElement,
          nameSelector,
          priceElement,
          priceSelector,
          imageElement,
          linkElement,
          evidenceCount
        };
      };

      const buildUniqueRootSelector = (
        element,
        strategySelector,
        linkElement
      ) => {
        const testIdentifier = getTestIdentifier(element);
        const testIdSelector = buildAttributeSelector(
          testIdentifier.attribute,
          testIdentifier.value
        );

        if (
          testIdSelector &&
          document.querySelectorAll(testIdSelector).length === 1
        ) {
          return {
            selector: testIdSelector,
            strategy: 'test-id',
            testIdAttribute: testIdentifier.attribute,
            testIdValue: testIdentifier.value
          };
        }

        if (element.id) {
          const idSelector =
            `#${CSS.escape(element.id)}`;

          if (document.querySelectorAll(idSelector).length === 1) {
            return {
              selector: idSelector,
              strategy: 'id',
              testIdAttribute: null,
              testIdValue: null
            };
          }
        }

        const href =
          linkElement?.getAttribute('href');

        if (href) {
          const escapedHref =
            escapeSelectorValue(href);
          const linkSelector =
            `a[href="${escapedHref}"]`;
          const rootSelector = element.matches('a[href]')
            ? linkSelector
            : `${strategySelector}:has(${linkSelector})`;

          if (
            document.querySelectorAll(rootSelector).length === 1
          ) {
            return {
              selector: rootSelector,
              strategy: 'product-link',
              testIdAttribute: null,
              testIdValue: null
            };
          }
        }

        return null;
      };

      let selectedProductStrategy = null;
      let selectedProductConfidence = 0;
      let validatedProductCandidates = [];

           for (const strategy of productDiscoveryStrategies) {
        const candidates = [
          ...document.querySelectorAll(strategy.selector)
        ]
          .map((matchedElement) => {
            /*
             * In the hosted v1 application, data-test="product-N"
             * belongs to the product link, while the price is a sibling
             * inside the containing list row. Treat that row as the card.
             */
            const productRow =
              strategy.selector ===
                '[data-test^="product-"]'
                ? matchedElement.closest(
                    'li.list-group-item'
                  )
                : null;

            const element =
              productRow || matchedElement;

            return {
              element,
              rootStrategySelector:
                productRow
                  ? 'li.list-group-item'
                  : strategy.selector,
              parts: findProductParts(element)
            };
          })
          .filter(({ element }) =>
            isVisible(element)
          )
          .filter(({ parts }) => {
            return (
              parts.nameElement &&
              parts.evidenceCount >= 3
            );
          })
          .map(
            ({
              element,
              rootStrategySelector,
              parts
            }) => ({
              element,
              parts,
              rootSelector: buildUniqueRootSelector(
                element,
                rootStrategySelector,
                parts.linkElement
              )
            })
          )
          .filter(({ rootSelector }) =>
            rootSelector
          );

        if (candidates.length > 0) {
          selectedProductStrategy =
            strategy.selector;
          selectedProductConfidence =
            strategy.confidence;
          validatedProductCandidates =
            candidates;
          break;
        }
      }
      const productComponents = validatedProductCandidates
        .map((element) => {
          const candidate = element;
          element = candidate.element;

          const {
            nameElement,
            nameSelector,
            priceElement,
            priceSelector,
            imageElement,
            linkElement
          } = candidate.parts;

          const rootSelector =
            candidate.rootSelector.selector;

          const productTestId =
            candidate.rootSelector.testIdValue;

          const componentId =
            productTestId ||
            linkElement?.getAttribute('href') ||
            rootSelector;

          const categoryElement =
            element.querySelector(
              '[data-test="product-category"]'
            );

          const brandElement =
            element.querySelector(
              '[data-test="product-brand"]'
            );

          const childComponents = {};

          if (nameElement) {
            childComponents.name = {
              type: 'PRODUCT_NAME',

              relationship: 'DESCENDANT_OF_ROOT',

              selector: nameSelector,

              scopedSelector:
                `${rootSelector} ${nameSelector}`,

              tagName:
                nameElement.tagName.toLowerCase(),

              text: normalizeText(
                nameElement.innerText ||
                  nameElement.textContent ||
                  ''
              ),

              visible: isVisible(nameElement)
            };
          }

          if (priceElement) {
            childComponents.price = {
              type: 'PRODUCT_PRICE',

              relationship: 'DESCENDANT_OF_ROOT',

              selector: priceSelector,

              scopedSelector:
                `${rootSelector} ${priceSelector}`,

              tagName:
                priceElement.tagName.toLowerCase(),

              text: normalizeText(
                priceElement.innerText ||
                  priceElement.textContent ||
                  ''
              ),

              visible: isVisible(priceElement)
            };
          }

          if (imageElement) {
            childComponents.image = {
              type: 'PRODUCT_IMAGE',

              relationship: 'DESCENDANT_OF_ROOT',

              selector: 'img',

              scopedSelector:
                `${rootSelector} img`,

              tagName: 'img',

              alt:
                imageElement.getAttribute('alt'),

              src:
                imageElement.getAttribute('src'),

              visible: isVisible(imageElement)
            };
          }

          if (categoryElement) {
            childComponents.category = {
              type: 'PRODUCT_CATEGORY',

              relationship: 'DESCENDANT_OF_ROOT',

              selector:
                '[data-test="product-category"]',

              scopedSelector:
                `${rootSelector} [data-test="product-category"]`,

              tagName:
                categoryElement.tagName.toLowerCase(),

              text: normalizeText(
                categoryElement.innerText ||
                  categoryElement.textContent ||
                  ''
              ),

              visible: isVisible(categoryElement)
            };
          }

          if (brandElement) {
            childComponents.brand = {
              type: 'PRODUCT_BRAND',

              relationship: 'DESCENDANT_OF_ROOT',

              selector:
                '[data-test="product-brand"]',

              scopedSelector:
                `${rootSelector} [data-test="product-brand"]`,

              tagName:
                brandElement.tagName.toLowerCase(),

              text: normalizeText(
                brandElement.innerText ||
                  brandElement.textContent ||
                  ''
              ),

              visible: isVisible(brandElement)
            };
          }

          const productName =
            childComponents.name?.text ||
            normalizeText(
              element.innerText ||
                element.textContent ||
                ''
            ) ||
            componentId;

          const assertionCandidates = [
            {
              target: 'root',
              assertion: 'toBeVisible',
              selector: rootSelector
            }
          ];

          if (childComponents.name) {
            assertionCandidates.push({
              target: 'name',
              assertion: 'toBeVisible',
              selector:
                childComponents.name.scopedSelector
            });

            if (childComponents.name.text) {
              assertionCandidates.push({
                target: 'name',
                assertion: 'toHaveText',
                selector:
                  childComponents.name.scopedSelector,
                expectedValue:
                  childComponents.name.text
              });
            }
          }

          if (childComponents.price) {
            assertionCandidates.push({
              target: 'price',
              assertion: 'toBeVisible',
              selector:
                childComponents.price.scopedSelector
            });

            if (childComponents.price.text) {
              assertionCandidates.push({
                target: 'price',
                assertion: 'toHaveText',
                selector:
                  childComponents.price.scopedSelector,
                expectedValue:
                  childComponents.price.text
              });
            }
          }

          if (
            childComponents.image &&
            childComponents.image.alt
          ) {
            assertionCandidates.push({
              target: 'image',
              assertion: 'toHaveAttribute',
              selector:
                childComponents.image.scopedSelector,
              attribute: 'alt',
              expectedValue:
                childComponents.image.alt
            });
          }

          return {
            componentId,

            type: 'PRODUCT_CARD',

            name: productName,

            root: {
              selector: rootSelector,

              selectorStrategy:
                candidate.rootSelector.strategy,

              testIdAttribute:
                candidate.rootSelector.testIdAttribute,

              testIdValue: productTestId,

              tagName:
                element.tagName.toLowerCase(),

              visible: isVisible(element),

              clickable: element.matches(
                'a[href], button, [role="button"]'
              ),

              href:
                element.getAttribute('href')
            },

            children: childComponents,

            relationships: Object.keys(
              childComponents
            ).map((childName) => ({
              parentComponentId: componentId,
              childName,
              relationship: 'CONTAINS'
            })),

            assertionCandidates
          };
        });

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

        explicitRoleElements: roleElements,

        productComponents,

        productDiscovery: {
          selectedStrategy:
            selectedProductStrategy,

          confidence:
            selectedProductConfidence,

          productCardCount:
            productComponents.length,

          warning:
            productComponents.length === 0
              ? 'No product cards discovered: no supported discovery strategy matched validated, uniquely addressable product cards.'
              : null
        }
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
      if (
        !element.dataTestId ||
        !element.dataTestAttribute
      ) {
        continue;
      }

      candidateSelectors.push({
        strategy: 'test-id',

        selector:
          `[${element.dataTestAttribute}="${escapeSelectorValue(
            element.dataTestId
          )}"]`,

        value: element.dataTestId,

        attribute:
          element.dataTestAttribute,

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
            `getByRole('${button.role}', { name: '${cleanText(
              button.ariaLabel
            )}' })`,

          role: button.role,

          accessibleName:
            button.ariaLabel,

          tagName: button.tagName,

          confidence: 0.95
        });

        continue;
      }

      if (button.text) {
        candidateSelectors.push({
          strategy: 'button-name',

          selector:
            `getByRole('button', { name: '${cleanText(
              button.text
            )}' })`,

          role: 'button',

          accessibleName:
            cleanText(button.text),

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
            `getByLabel('${cleanText(
              input.ariaLabel
            )}')`,

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
            `getByPlaceholder('${cleanText(
              input.placeholder
            )}')`,

          placeholder:
            cleanText(input.placeholder),

          tagName: input.tagName,

          confidence: 0.85
        });
      }
    }

    const completedAt = new Date().toISOString();

    const acceptedCandidateSelectors =
      candidateSelectors.filter(
        (candidate) =>
          candidate.confidence >= 0.85
      );

    const productComponents =
      Array.isArray(pageData.productComponents)
        ? pageData.productComponents
        : [];

    const selectorLibrary = {
      schemaVersion: '1.1',

      storyKey,
      executionId,
      discoveryId,

      application: {
        name: applicationName,

        pageTitle:
          pageData.document.title,

        pageUrl:
          pageData.document.url
      },

      generatedAt: completedAt,

      productDiscovery: {
        selectedStrategy:
          pageData.productDiscovery.selectedStrategy,

        confidence:
          pageData.productDiscovery.confidence,

        productCardCount:
          pageData.productDiscovery.productCardCount,

        warning:
          pageData.productDiscovery.warning
      },

      selectors: acceptedCandidateSelectors.map(
        (candidate) => ({
          name:
            candidate.value ||
            candidate.accessibleName ||
            candidate.placeholder ||
            candidate.selector,

          strategy:
            candidate.strategy,

          selector:
            candidate.selector,

          attribute:
            candidate.attribute || null,

          tagName:
            candidate.tagName || null,

          text:
            candidate.text || null,

          accessibleName:
            candidate.accessibleName || null,

          confidence:
            candidate.confidence
        })
      ),

      testIds: pageData.testIdElements
        .filter(
          (element) =>
            element.dataTestId &&
            element.dataTestAttribute
        )
        .map((element) => ({
          name:
            element.dataTestId,

          attribute:
            element.dataTestAttribute,

          selector:
            `[${element.dataTestAttribute}="${escapeSelectorValue(
              element.dataTestId
            )}"]`,

          tagName:
            element.tagName,

          text:
            element.text || null,

          role:
            element.role || null,

          visible:
            element.visible
        })),

      components: productComponents,

      componentTypes: {
        PRODUCT_CARD: {
          count:
            productComponents.length,

          relationshipModel:
            'ROOT_WITH_SCOPED_CHILDREN',

          availableChildren: uniqueStrings(
            productComponents.flatMap(
              (component) =>
                Object.keys(
                  component.children || {}
                )
            )
          )
        }
      },

      summary: {
        selectorCount:
          acceptedCandidateSelectors.length,

        testIdSelectorCount:
          pageData.testIdElements.filter(
            (element) =>
              element.dataTestId &&
              element.dataTestAttribute
          ).length,

        componentCount:
          productComponents.length,

        productCardCount:
          productComponents.length
      }
    };

    fs.writeFileSync(
      'selector-library.json',
      JSON.stringify(
        selectorLibrary,
        null,
        2
      )
    );

    const discoveryResult = {
      schemaVersion: '1.1',

      storyKey,
      executionId,
      discoveryId,

      application: {
        name: applicationName,

        requestedUrl:
          targetUrl,

        discoveredUrl:
          pageData.document.url
      },

      discovery: {
        scope:
          discoveryScope,

        status:
          'COMPLETED',

        startedAt,

        completedAt
      },

      productDiscovery: {
        selectedStrategy:
          pageData.productDiscovery.selectedStrategy,

        confidence:
          pageData.productDiscovery.confidence,

        productCardCount:
          pageData.productDiscovery.productCardCount,

        warning:
          pageData.productDiscovery.warning
      },

      page: pageData.document,

      summary: {
        headingCount:
          pageData.headings.length,

        linkCount:
          pageData.links.length,

        buttonCount:
          pageData.buttons.length,

        inputCount:
          pageData.inputs.length,

        formCount:
          pageData.forms.length,

        landmarkCount:
          pageData.landmarks.length,

        imageCount:
          pageData.images.length,

        tableCount:
          pageData.tables.length,

        listCount:
          pageData.lists.length,

        dialogCount:
          pageData.dialogs.length,

        dataTestIdCount:
          dataTestIds.length,

        explicitRoleCount:
          explicitRoles.length,

        candidateSelectorCount:
          candidateSelectors.length,

        acceptedSelectorCount:
          acceptedCandidateSelectors.length,

        componentCount:
          productComponents.length,

        productCardCount:
          productComponents.length
      },

      elements: {
        headings:
          pageData.headings,

        links:
          pageData.links,

        buttons:
          pageData.buttons,

        inputs:
          pageData.inputs,

        forms:
          pageData.forms,

        landmarks:
          pageData.landmarks,

        images:
          pageData.images,

        tables:
          pageData.tables,

        lists:
          pageData.lists,

        dialogs:
          pageData.dialogs
      },

      components: {
        productCards:
          productComponents
      },

      selectorDiscovery: {
        dataTestIds,

        explicitRoles,

        candidates:
          candidateSelectors,

        acceptedCandidates:
          acceptedCandidateSelectors
      },

      accessibility: {
        snapshot:
          accessibilitySnapshot
      },

      artifacts: {
        screenshot:
          'homepage.png',

        discoveryJson:
          'application-discovery.json',

        selectorLibrary:
          'selector-library.json'
      },

      github: {
        workflowRunId,
        workflowRunAttempt,
        commitSha
      }
    };

    fs.writeFileSync(
      'application-discovery.json',
      JSON.stringify(
        discoveryResult,
        null,
        2
      )
    );

    if (pageData.productDiscovery.warning) {
      console.warn(
        pageData.productDiscovery.warning
      );
    }

    console.log(
      JSON.stringify(
        discoveryResult.summary,
        null,
        2
      )
    );

    await context.close();
  } catch (error) {
    const failedAt =
      new Date().toISOString();

    const failureResult = {
      schemaVersion: '1.1',

      storyKey,
      executionId,
      discoveryId,

      application: {
        name:
          applicationName,

        requestedUrl:
          targetUrl
      },

      discovery: {
        scope:
          discoveryScope,

        status:
          'FAILED',

        startedAt,

        completedAt:
          failedAt
      },

      error: {
        name:
          error.name,

        message:
          error.message,

        stack:
          error.stack
      },

      github: {
        workflowRunId,
        workflowRunAttempt,
        commitSha
      }
    };

    fs.writeFileSync(
      'application-discovery.json',
      JSON.stringify(
        failureResult,
        null,
        2
      )
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
