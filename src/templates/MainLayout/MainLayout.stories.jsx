import MainLayout from "./MainLayout";

export default {
  title: "Templates/MainLayout",
  component: MainLayout,
  tags: ["autodocs"],
};

// The template only places content; this story fills it with placeholder text.
export const WithPlaceholderContent = {
  args: {
    watchlistCount: 3,
    children: (
      <header className="page-header">
        <h1>Page title</h1>
        <p>Any page content goes here.</p>
      </header>
    ),
  },
};
