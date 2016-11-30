export const uuid = () => {
  const d = new Date()
  return d.getTime().toString(16)
}
