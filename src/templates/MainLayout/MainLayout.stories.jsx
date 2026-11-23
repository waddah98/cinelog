import MainLayout from "./MainLayout";

export default {
  title: "Templates/MainLayout",
  component: MainLayout,
  parameters: { layout: "fullscreen" },
};

// The template only places content; this story fills it with placeholder blocks.
export const WithPlaceholderContent = {
  args: {
    watchlistCount: 3,
    children: (
      <>
        <header className="page-header">
          <h1>Page title</h1>
          <p>Any page content goes here.</p>
        </header>
        <div style={{ height: 200, border: "1px dashed #2e323c", borderRadius: 16 }} />
      </>
    ),
  },
};
