# 🌟 Dynamic Storytelling with Pollinations Generative React Hooks & Components

This project demonstrates how to create dynamic storytelling experiences using [Pollinations Generative React Hooks & Components](https://www.npmjs.com/package/@pollinations/react) in a [Next.js](https://nextjs.org) environment. By integrating with the [Pollinations.ai](https://pollinations.ai) API, this example showcases how to generate text, images, and more, all from user prompts—unlocking a wide range of generative content creation.

## 🚀 Getting Started

![Example](https://storytelling.karma.yt/preview-2024-09-16-15-09-21.png)

Follow these steps to set up and run the project:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/diogo-karma/pollinations-storytelling
    cd karma
    ```

2. **Install dependencies**:

    Depending on your package manager:

    ```bash
    npm install    # or yarn install
    pnpm install   # or bun install
    ```

3. **Start the development server**:

    Launch the development environment:

    ```bash
    npm run dev    # or yarn dev
    pnpm dev       # or bun dev
    ```

4. **Access the app**:

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the app live. You can start modifying the code by editing the `app/page.tsx` file. Any changes will automatically be reflected.

---

## 🧩 Pollinations Generative React Hooks & Components

Harness the power of Pollinations.ai to easily generate dynamic content. Below are examples of key components from the `@pollinations/react` library:

### `PollinationsText`

Generate and display text based on a given prompt and seed using the Pollinations API.

```jsx
import React from 'react';
import { PollinationsText } from '@pollinations/react';

const TermsAndConditions = () => (
  <PollinationsText seed={42}>
    Write out Pollinations.AI terms and conditions in Chinese.
  </PollinationsText>
);

export default TermsAndConditions;
```

### `PollinationsMarkdown`

Render markdown content dynamically based on a prompt.

```jsx
import React from 'react';
import { PollinationsMarkdown } from '@pollinations/react';

const AdSlogan = () => (
  <PollinationsMarkdown seed={42}>
    Create a cool advertising slogan about Pollinations in markdown.
  </PollinationsMarkdown>
);

export default AdSlogan;
```

### `PollinationsImage`

Generate and display an image from a text prompt and seed.

```jsx
import React from 'react';
import { PollinationsImage } from '@pollinations/react';

const SunsetImage = () => (
  <PollinationsImage prompt="A beautiful sunset over the ocean" width={800} height={600} seed={42} />
);

export default SunsetImage;
```

---

## 💡 Learn More

- Explore the [Pollinations Generative React Hooks & Components](https://www.npmjs.com/package/@pollinations/react) on npm.
- Visit [KARMA.YT](https://karma.yt) to discover more about the project.
- Learn more about [Pollinations.ai](https://pollinations.ai/readme).

### Made with ❤️ by [KARMA.YT](https://karma.yt) and [Pollinations.ai](https://pollinations.ai) Team
