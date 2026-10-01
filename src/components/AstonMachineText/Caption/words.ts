function makeWord(...content: (Node | string)[]) {
  const word = document.createElement('span');
  const glyphs = document.createElement('span');
  word.className = 'word';
  glyphs.className = 'ink';
  glyphs.append(...content);
  word.append(glyphs);
  return word;
}

function wrapLinksWhole(root: HTMLElement) {
  for (const link of root.querySelectorAll('a')) link.append(makeWord(...link.childNodes));
}

export function wrapWords(root: HTMLElement) {
  wrapLinksWhole(root);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement!.closest('.word') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
  for (const node of textNodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.textContent!.split(/(\s+)/)) {
      if (!part) continue;
      fragment.append(/^\s+$/.test(part) ? part : makeWord(part));
    }
    node.replaceWith(fragment);
  }
  return [...root.querySelectorAll<HTMLElement>('.word')];
}
