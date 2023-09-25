import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'e17'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '628'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'dc4'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '92a'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', 'a0e'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', 'dce'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '333'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '321'),
    routes: [
      {
        path: '/docs/backend/',
        component: ComponentCreator('/docs/backend/', '7dc'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/backend/auth',
        component: ComponentCreator('/docs/backend/auth', '387'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/backend/nextjs',
        component: ComponentCreator('/docs/backend/nextjs', '300'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/backend/prisma',
        component: ComponentCreator('/docs/backend/prisma', '327'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cicd/',
        component: ComponentCreator('/docs/cicd/', '16e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/frontend/framer-motion',
        component: ComponentCreator('/docs/frontend/framer-motion', '8db'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/frontend/react',
        component: ComponentCreator('/docs/frontend/react', '66a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/frontend/tailwind',
        component: ComponentCreator('/docs/frontend/tailwind', 'e0f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/frontend/typescript',
        component: ComponentCreator('/docs/frontend/typescript', 'b88'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/intro',
        component: ComponentCreator('/docs/intro', 'aed'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/komme-igang/',
        component: ComponentCreator('/docs/komme-igang/', '94c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/komme-igang/forste-endring',
        component: ComponentCreator('/docs/komme-igang/forste-endring', 'e26'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/komme-igang/platformer',
        component: ComponentCreator('/docs/komme-igang/platformer', '5a0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/komme-igang/scripts',
        component: ComponentCreator('/docs/komme-igang/scripts', 'b09'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/komme-igang/verktoy',
        component: ComponentCreator('/docs/komme-igang/verktoy', '3d3'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/ressurser',
        component: ComponentCreator('/docs/ressurser', '6c9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/sanity/',
        component: ComponentCreator('/docs/sanity/', 'a93'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/sanity/dokumenter',
        component: ComponentCreator('/docs/sanity/dokumenter', '949'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/sanity/felt-og-typer',
        component: ComponentCreator('/docs/sanity/felt-og-typer', '85c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/sanity/groq',
        component: ComponentCreator('/docs/sanity/groq', 'e3f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/sanity/objekter',
        component: ComponentCreator('/docs/sanity/objekter', '11c'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '897'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
