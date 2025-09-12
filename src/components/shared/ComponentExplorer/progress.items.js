// progress.items.js
export const progressItems = [
  {
    id: 1,
    label: "Demo Wizard",
    checked: true,
    componentName: "DemoWizard",
    load: () => import("../../shared/ResponsiveMobileViewer/MobileView.jsx")
  },
  {
    id: 2,
    label: "Card Material Form",
    checked: true,
    componentName: "CardMatForm",
    load: () => import("../../shared/CardMatForm/CardOneMatForm.jsx")
  },
  {
    id: 3,
    label: "HTML Editor",
    checked: true,
    componentName: "HTMLEditor",
    load: () => import("../../shared/HTMLEditor/HTMLQuillEditor.jsx")
  },
    {
    id: 4,
    label: "Markdown",
    checked: true,
    componentName: "DemoWizard",
    load: () => import("../../shared/markdown/MarkdownEditor.jsx")
  },

 
];
