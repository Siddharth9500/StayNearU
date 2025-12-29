// Utility functions
export const createPageUrl = (page, params = {}) => {
  return `/${page}?${new URLSearchParams(params).toString()}`
}

export const getImageUrl = (path) => {
  return path || '/placeholder.jpg'
}
