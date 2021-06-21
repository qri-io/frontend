import React from 'react'

interface MetaChipsProps {
  words: string[]
}

const MetaChips: React.FunctionComponent<MetaChipsProps> = ({ words }) => (
   <div>
     {words.map((d, i) => (
       <span key={i} className='leading-tight text-gray-400 text-xs tracking-wider inline-block border border-qrigray-400 rounded-md px-2 py-1 mr-1 mb-1'>{d}</span>
     ))}
   </div>
)

export default MetaChips
