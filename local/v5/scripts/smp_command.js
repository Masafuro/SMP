function getTextById(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`ID "${id}" を持つ要素が見つかりませんでした。`);
    return null;
  }
  return element.innerText;
}

function setTextById(id, text) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`要素が見つかりません: id="${id}"`);
    return false;
  }
  element.innerText = text;
  return true;
}
