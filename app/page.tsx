'use client'

import React, { useState, FC } from 'react';
import { nanoid } from '@/lib/utils';
import Decider from '@/components/decider';
import { DataContext } from '../context/DataContext';

export const runtime = 'edge';
export const maxDuration = 120

const IndexPage: FC = () => {
  const id = nanoid();
  const [data, setData] = useState({ model: "gpt-4" });
  
  // console.log(`data`, data);

  return (
    <DataContext.Provider value={[data, setData]}>
      <Decider id={id} cam={null} />
    </DataContext.Provider>
  );
};

export default IndexPage;






// import { nanoid } from '@/lib/utils'
// import  Decider from '@/components/decider'
// import { useState } from 'react';
// import { DataContext } from '../context/DataContext';
// import '../i18n'

// export const runtime = 'edge'


// export default function IndexPage(children: React.ReactNode) {
//   const id = nanoid()
//   const [data, setData] = useState({ agency: 'Fannie Mae', model: "gpt-4", page: 'psge.tsx' });
//   console.log(`data`, data)
//   return (
//     <DataContext.Provider  value={[data, setData]} >
//       <Decider id={id} cam={null} />
//     </DataContext.Provider>
//      )
// }



