export default createElement = ({ tag, attrs }) => {
  const el = document.createElement(tag);

  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }

  return el;
};