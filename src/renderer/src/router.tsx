import { createBrowserRouter } from 'react-router'
import { Headbreak } from './Headbreak'

export const router = createBrowserRouter([
  {
    path: '/:modal?',
    Component: Headbreak
  }
])
