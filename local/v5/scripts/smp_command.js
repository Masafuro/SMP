export function getTextById(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.log(`ID "${id}" を持つ要素が見つかりませんでした。`);
    return "NO_ID";
  }
  return element.textContent;
}

export function setTextById(id, text) {
  const element = document.getElementById(id);
  if (!element) {
    console.log(`要素が見つかりません: id="${id}"`);
    return "NO_ID";
  }
  element.textContent = text;
  return true;
}

export function parseJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error("JSONのパースに失敗しました:", error.message);
    return null;
  }
}
