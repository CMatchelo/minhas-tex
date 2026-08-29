import { Html, Head, Main, NextScript } from "next/document";

const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var isDark = saved === 'dark' || (saved === null && !window.matchMedia('(prefers-color-scheme: light)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();
`;

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head />
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
