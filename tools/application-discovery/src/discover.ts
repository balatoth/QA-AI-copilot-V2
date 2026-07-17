import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

interface DiscoveryConfiguration {
  storyKey: string;
  executionId: string;
  discoveryId: string;
  applicationName: string;
  baseUrl: string;
  startPath: string;
  discoveryScope: 'SINGLE_PAGE';
}

interface ApplicationDiscoveryArtifact {
  executionId: string;
  discoveryId: string;
  storyKey: string;
  application: {
    name: string;
    baseUrl: string;
    startPath: string;
    targetUrl: string;
  };
  discovery: {
    scope: 'SINGLE_PAGE';
    status: 'COMPLETED' | 'FAILED';
    startedAt: string;
    completedAt: string;
  };
  page: {
    url: string;
    title: string;
    heading: string | null;
  };
}

const config: DiscoveryConfiguration = {
  storyKey: process.env.STORY_KEY ?? 'MP-1',
  executionId: process.env.EXECUTION_ID ?? 'MP-DISCOVERY-LOCAL-001',
  discoveryId:
    process.env.DISCOVERY_ID ??
    'MP-1-MP-DISCOVERY-LOCAL-001',
  applicationName:
    process.env.APPLICATION_NAME ??
    'Practice Software Testing',
  baseUrl:
    process.env.BASE_URL ??
    'http://localhost:4200',
  startPath: process.env.START_PATH ?? '/',
  discoveryScope: 'SINGLE_PAGE'
};

const repositoryRoot = path.resolve(
  process.cwd(),
  '../..'
);

const artifactDirectory = path.join(
  repositoryRoot,
  'executions',
  config.storyKey,
  'discovery',
  config.discoveryId
);

const discoveryJsonPath = path.join(
  artifactDirectory,
  'application-discovery.json'
);

const screenshotPath = path.join(
  artifactDirectory,
  'homepage.png'
);

const targetUrl = new URL(
  config.startPath,
  config.baseUrl
).toString();

async function runDiscovery(): Promise<void> {
  const startedAt = new Date().toISOString();

  console.log('Starting local application discovery');
  console.log(`Story: ${config.storyKey}`);
  console.log(`Discovery ID: ${config.discoveryId}`);
  console.log(`Target URL: ${targetUrl}`);

  await mkdir(artifactDirectory, {
    recursive: true
  });

  const browser = await chromium.launch({
    headless: true
  });

  try {
    const context = await browser.newContext({
      viewport: {
        width: 1440,
        height: 900
      }
    });

    const page = await context.newPage();

    const response = await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000
    });

    if (!response) {
      throw new Error(
        `No HTTP response was returned for ${targetUrl}`
      );
    }

    if (!response.ok()) {
      throw new Error(
        `Application returned HTTP ${response.status()}`
      );
    }

    await page.waitForLoadState('networkidle', {
      timeout: 15_000
    }).catch(() => {
      console.warn(
        'Network did not become idle; continuing with the loaded page.'
      );
    });

    const title = await page.title();

    const heading = await page
      .locator('h1')
      .first()
      .textContent()
      .catch(() => null);

    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    const completedAt = new Date().toISOString();

    const artifact: ApplicationDiscoveryArtifact = {
      executionId: config.executionId,
      discoveryId: config.discoveryId,
      storyKey: config.storyKey,
      application: {
        name: config.applicationName,
        baseUrl: config.baseUrl,
        startPath: config.startPath,
        targetUrl
      },
      discovery: {
        scope: config.discoveryScope,
        status: 'COMPLETED',
        startedAt,
        completedAt
      },
      page: {
        url: page.url(),
        title,
        heading: heading?.trim() || null
      }
    };

    await writeFile(
      discoveryJsonPath,
      JSON.stringify(artifact, null, 2),
      'utf8'
    );

    console.log('');
    console.log('Discovery completed successfully');
    console.log(`Page title: ${title}`);
    console.log(`Artifact: ${discoveryJsonPath}`);
    console.log(`Screenshot: ${screenshotPath}`);

    await context.close();
  } finally {
    await browser.close();
  }
}

runDiscovery().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  console.error('');
  console.error('Application discovery failed');
  console.error(message);

  process.exitCode = 1;
});
