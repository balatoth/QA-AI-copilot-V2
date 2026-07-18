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
    if (!targetUrl) {
      throw new Error('TARGET_URL is required.');
    }

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
          `[HTTP ${response.status()}] ` +
          `${response.request().method()} ${response.url()}`
        );
      }
    });

    console.log(`Opening discovery target: ${targetUrl}`);

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

    /*
     * Wait for meaningful visible page content.
     *
     * This is deliberately application-agnostic. Product cards are optional:
     * a sprint may expose only API capability, a form, a dashboard, or another
     * UI structure.
     */
    console.log('Waiting for meaningful page content...');

    await page.waitForFunction(() => {
      const bodyText = document.body?.innerText?.replace(/\s+/g, ' ').trim() || '';

      const meaningfulElements = [
        ...document.querySelectorAll(
          'main, [role="main"], h1, h2, h3, a[href], button, input, ' +
          'select, textarea, table, [role="grid"], [data-testid], ' +
          '[data-test], [data-cy], img'
        )
      ].filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          Number(style.opacity) !== 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      });

      return bodyText.length > 20 || meaningfulElements.length > 0;
    }, {
      timeout: 30000
    });

    console.log('Meaningful page content detected.');

    /*
     * Give late-rendering client-side applications a small stability window.
     * This is not tied to a specific framework or CSS class.
     */
    await page.waitForTimeout(1500);

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
        if (!element) {
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

      const getTestAttribute = (element) => {
        if (element.hasAttribute('data-testid')) {
          return {
            name: 'data-testid',
            value: element.getAttribute('data-testid')
          };
        }

        if (element.hasAttribute('data-test')) {
          return {
            name: 'data-test',
            value: element.getAttribute('data-test')
          };
        }

        if (element.hasAttribute('data-cy')) {
          return {
            name: 'data-cy',
            value: element.getAttribute('data-cy')
          };
        }

        return {
          name: null,
          value: null
        };
      };

      const getElementSummary = (element) => {
        const testAttribute = getTestAttribute(element);

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

          testAttributeName:
            testAttribute.name,

          dataTestId:
            testAttribute.value,

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

      /*
       * Discover product-like repeated records without depending on ".card".
       *
       * Strategy order:
       * 1. Stable product instance test IDs such as data-test="product-1".
       * 2. Product-detail links such as #/product/1 or /product/1.
       * 3. Visible .card containers as a compatibility fallback.
       *
       * Child fields such as product-name and product-price are excluded as
       * product roots. Each record is deduplicated by its strongest stable key.
       */
      const isProductInstanceTestId = (value) =>
        /^product-(?:\d+|[a-z0-9][a-z0-9_-]*\d[a-z0-9_-]*)$/i.test(
          String(value || '')
        ) &&
        ![
          'product-name',
          'product-price',
          'product-image',
          'product-description'
        ].includes(String(value || '').toLowerCase());

      const isProductHref = (href) =>
        /(?:#\/|\/)products?\/[^/?#]+/i.test(String(href || ''));

      const rootCandidates = [];

      for (const element of allElements) {
        if (!isVisible(element)) {
          continue;
        }

        const testValue =
          element.getAttribute('data-testid') ||
          element.getAttribute('data-test') ||
          element.getAttribute('data-cy');

        const href =
          element.matches('a[href]')
            ? element.getAttribute('href')
            : null;

        if (
          isProductInstanceTestId(testValue) ||
          isProductHref(href)
        ) {
          rootCandidates.push(element);
        }
      }

      if (rootCandidates.length === 0) {
        for (const card of document.querySelectorAll('.card')) {
          if (
            isVisible(card) &&
            !card.classList.contains('skeleton') &&
            !card.closest('.skeleton')
          ) {
            rootCandidates.push(card);
          }
        }
      }

      const findProductContainer = (root) => {
        let current = root;

        for (let depth = 0; current && depth < 5; depth += 1) {
          const hasName = Boolean(
            current.querySelector(
              '[data-testid*="name"], ' +
              '[data-test*="name"], ' +
              '[data-cy*="name"], ' +
              '.card-title, h2, h3, h4'
            )
          );

          const hasPrice = Boolean(
            current.querySelector(
              '[data-testid*="price"], ' +
              '[data-test*="price"], ' +
              '[data-cy*="price"], ' +
              '.card-price, .price'
            )
          );

          if (hasName && hasPrice) {
            return current;
          }

          current = current.parentElement;
        }

        return root;
      };

      const seenProductKeys = new Set();
      const productCards = [];

      for (const root of rootCandidates) {
        const container = findProductContainer(root);

        const titleElement =
          container.querySelector(
            '[data-testid*="name"], ' +
            '[data-test*="name"], ' +
            '[data-cy*="name"], ' +
            '.card-title, h2, h3, h4'
          ) ||
          (
            root.matches(
              '[data-testid*="name"], ' +
              '[data-test*="name"], ' +
              '[data-cy*="name"], ' +
              '.card-title, h2, h3, h4'
            )
              ? root
              : null
          );

        const priceElement =
          container.querySelector(
            '[data-testid*="price"], ' +
            '[data-test*="price"], ' +
            '[data-cy*="price"], ' +
            '.card-price, .price'
          );

        const linkElement =
          root.matches('a[href]')
            ? root
            : (
                container.matches('a[href]')
                  ? container
                  : container.querySelector(
                      'a[href*="/product/"], ' +
                      'a[href*="/products/"], ' +
                      'a[href*="#/product/"], ' +
                      'a[href*="#/products/"]'
                    )
              );

        const imageElement =
          container.querySelector('img');

        const rootTestAttribute = getTestAttribute(root);
        const linkHref = linkElement?.getAttribute('href') || null;
        const titleText = normalizeText(
          titleElement?.innerText ||
          titleElement?.textContent ||
          root.innerText ||
          root.textContent ||
          ''
        );

        const dedupeKey =
          rootTestAttribute.value ||
          linkHref ||
          `${titleText}|${normalizeText(priceElement?.textContent || '')}`;

        if (!dedupeKey || seenProductKeys.has(dedupeKey)) {
          continue;
        }

        seenProductKeys.add(dedupeKey);

        productCards.push({
          index: productCards.length,

          discoveryStrategy:
            isProductInstanceTestId(rootTestAttribute.value)
              ? 'product-instance-test-id'
              : (
                  isProductHref(linkHref)
                    ? 'product-link'
                    : 'visible-card-fallback'
                ),

          container:
            getElementSummary(container),

          root:
            getElementSummary(root),

          title:
            titleElement
              ? getElementSummary(titleElement)
              : null,

          price:
            priceElement
              ? getElementSummary(priceElement)
              : null,

          link:
            linkElement
              ? getElementSummary(linkElement)
              : null,

          image:
            imageElement
              ? {
                  ...getElementSummary(imageElement),
                  alt:
                    imageElement.getAttribute('alt'),
                  src:
                    imageElement.getAttribute('src')
                }
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
          'header, nav, main, aside, footer, ' +
          '[role="banner"], ' +
          '[role="navigation"], ' +
          '[role="main"], ' +
          '[role="complementary"], ' +
          '[role="contentinfo"]'
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

        productCards,

        testIdElements,

        explicitRoleElements: roleElements
      };
    });

    console.log(
      `Discovered product records: ${pageData.productCards.length}`
    );

    if (pageData.productCards.length > 0) {
      console.log(
        'First discovered product record:',
        JSON.stringify(pageData.productCards[0], null, 2)
      );
    } else {
      console.log(
        'No product records were discovered. General page discovery will still be persisted.'
      );
    }

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
        !element.testAttributeName
      ) {
        continue;
      }

      candidateSelectors.push({
        strategy: 'test-id',

        selector:
          `[${element.testAttributeName}="${element.dataTestId}"]`,

        value: element.dataTestId,

        testAttributeName:
          element.testAttributeName,

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
            `getByRole('${button.role}', { name: '${cleanText(button.ariaLabel)}' })`,

          role: button.role,

          accessibleName:
            cleanText(button.ariaLabel),

          tagName:
            button.tagName,

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

          accessibleName:
            cleanText(button.text),

          tagName:
            button.tagName,

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

          tagName:
            input.tagName,

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

          tagName:
            input.tagName,

          confidence: 0.85
        });
      }
    }

    /*
     * Add grounded product selectors derived from the discovered DOM.
     */
    for (const product of pageData.productCards) {
      const root = product.root || product.container;

      if (
        root?.dataTestId &&
        root?.testAttributeName
      ) {
        candidateSelectors.push({
          strategy: 'product-root-test-id',

          selector:
            `[${root.testAttributeName}="${root.dataTestId}"]`,

          value:
            root.dataTestId,

          tagName:
            root.tagName,

          text:
            product.title?.text || root.text || null,

          confidence: 1
        });
      } else if (product.link?.href) {
        candidateSelectors.push({
          strategy: 'product-link',

          selector:
            `a[href="${product.link.href}"]`,

          value:
            product.link.href,

          tagName:
            product.link.tagName,

          text:
            product.title?.text || product.link.text || null,

          confidence: 0.95
        });
      }
    }

    /*
     * Deduplicate selectors while preserving the highest-confidence record.
     */
    const selectorMap = new Map();

    for (const candidate of candidateSelectors) {
      const existing = selectorMap.get(candidate.selector);

      if (
        !existing ||
        candidate.confidence > existing.confidence
      ) {
        selectorMap.set(candidate.selector, candidate);
      }
    }

    const uniqueCandidateSelectors = [
      ...selectorMap.values()
    ];

    const completedAt = new Date().toISOString();

    const highConfidenceSelectors =
      uniqueCandidateSelectors.filter(
        (candidate) =>
          candidate.confidence >= 0.85
      );

    const selectorLibrary = {
      schemaVersion: '1.1',

      storyKey,
      executionId,
      discoveryId,

      application: {
        name: applicationName,
        pageTitle: pageData.document.title,
        pageUrl: pageData.document.url
      },

      generatedAt: completedAt,

      selectors: highConfidenceSelectors.map((candidate) => ({
        name:
          candidate.value ||
          candidate.accessibleName ||
          candidate.placeholder ||
          candidate.selector,

        strategy:
          candidate.strategy,

        selector:
          candidate.selector,

        tagName:
          candidate.tagName || null,

        text:
          candidate.text || null,

        accessibleName:
          candidate.accessibleName || null,

        confidence:
          candidate.confidence
      })),

      testIds: pageData.testIdElements
        .filter(
          (element) =>
            element.dataTestId &&
            element.testAttributeName
        )
        .map((element) => ({
          name:
            element.dataTestId,

          attribute:
            element.testAttributeName,

          selector:
            `[${element.testAttributeName}="${element.dataTestId}"]`,

          tagName:
            element.tagName,

          text:
            element.text || null,

          role:
            element.role || null,

          visible:
            element.visible
        })),

      products: pageData.productCards.map((product) => ({
        index:
          product.index,

        discoveryStrategy:
          product.discoveryStrategy,

        name:
          product.title?.text ||
          product.root?.text ||
          null,

        price:
          product.price?.text || null,

        href:
          product.link?.href || null,

        imageAlt:
          product.image?.alt || null,

        rootSelector:
          (
            product.root?.dataTestId &&
            product.root?.testAttributeName
          )
            ? `[${product.root.testAttributeName}="${product.root.dataTestId}"]`
            : (
                product.link?.href
                  ? `a[href="${product.link.href}"]`
                  : null
              )
      })),

      summary: {
        selectorCount:
          highConfidenceSelectors.length,

        testIdSelectorCount:
          pageData.testIdElements.filter(
            (element) =>
              element.dataTestId &&
              element.testAttributeName
          ).length,

        productSelectorCount:
          pageData.productCards.length
      }
    };

    fs.writeFileSync(
      'selector-library.json',
      JSON.stringify(selectorLibrary, null, 2)
    );

    const discoveryResult = {
      schemaVersion: '1.1',

      storyKey,
      executionId,
      discoveryId,

      application: {
        name: applicationName,
        requestedUrl: targetUrl,
        discoveredUrl:
          pageData.document.url
      },

      discovery: {
        scope: discoveryScope,
        status: 'COMPLETED',
        startedAt,
        completedAt
      },

      page:
        pageData.document,

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

        productCardCount:
          pageData.productCards.length,

        dataTestIdCount:
          dataTestIds.length,

        explicitRoleCount:
          explicitRoles.length,

        candidateSelectorCount:
          uniqueCandidateSelectors.length
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
          pageData.dialogs,

        productCards:
          pageData.productCards
      },

      selectorDiscovery: {
        dataTestIds,
        explicitRoles,
        candidates:
          uniqueCandidateSelectors
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
      JSON.stringify(discoveryResult, null, 2)
    );

    console.log(
      JSON.stringify(
        discoveryResult.summary,
        null,
        2
      )
    );

    await context.close();
  } catch (error) {
    const failedAt = new Date().toISOString();

    const failureResult = {
      schemaVersion: '1.1',

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
