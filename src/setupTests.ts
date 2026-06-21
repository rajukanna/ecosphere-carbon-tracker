import '@testing-library/jest-dom';

// Stub HTMLElement.prototype.scrollIntoView since jsdom doesn't implement it
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = function() {};
}
