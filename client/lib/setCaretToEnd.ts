export const setCaretToEnd = (element: any) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  // @ts-ignore
  selection.removeAllRanges();
  // @ts-ignore
  selection.addRange(range);
  element.focus();
};
