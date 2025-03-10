'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled for ReactFlow
const FlowApp = dynamic(() => import('./FlowApp'), {
  ssr: false,
});

const UserNode = () => {
  return(
    <div className="h-screen w-full">
      <FlowApp />
    </div>
  );
};

export default UserNode;