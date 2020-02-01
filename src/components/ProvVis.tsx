import React, { FC } from 'react'
import { Header } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export interface ProvVisProps {}

const ProvVis: FC<ProvVisProps> = () => {
  return <Header as="h1">Hello, World!</Header>
}

export default ProvVis
