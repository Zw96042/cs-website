export const graphNodes = [
  { id: 'A', x: 0.11, y: 0.5 },
  { id: 'B', x: 0.31, y: 0.2 },
  { id: 'C', x: 0.3, y: 0.75 },
  { id: 'D', x: 0.53, y: 0.37 },
  { id: 'E', x: 0.55, y: 0.78 },
  { id: 'F', x: 0.77, y: 0.58 },
  { id: 'G', x: 0.89, y: 0.23 }
]

export const graphEdges = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 1 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'C', to: 'D', weight: 8 },
  { from: 'C', to: 'E', weight: 10 },
  { from: 'D', to: 'E', weight: 2 },
  { from: 'D', to: 'F', weight: 6 },
  { from: 'E', to: 'F', weight: 3 },
  { from: 'F', to: 'G', weight: 1 }
]

export const sortValues = [72, 28, 91, 44, 63, 17, 55, 36]
