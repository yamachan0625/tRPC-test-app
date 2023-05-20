// import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { trpc } from '../utils/trpc';
// import { AppRouter } from '../../../server';
// import { useEffect } from 'react';

const Test = () => {
  const utils = trpc.useContext();
  const addTodo = trpc.addTodo.useMutation({
    onSuccess: () => {
      utils.todos.invalidate();
    },
  });

  const handleKeyDown = (e) => {
    const name = e.target.value;
    if (e.key === 'Enter' && name) {
      addTodo.mutate({ name });
      e.target.value = '';
    }
  };

  // const hello = trpc.hello.useQuery();
  const aaa = trpc.helloName.useQuery({ name: 'yuya', age: 20 });
  const todos = trpc.todos.useQuery();
  // console.log(todos.data?.host);

  return (
    <div>
      <div>
        <label id="name">Add Todo:</label>
        <input name="name" onKeyDown={handleKeyDown} />
      </div>
      {todos.data?.todos.map((d) => d.name)}
    </div>
  );
};

// react-queryを利用しない場合
// const client = createTRPCProxyClient<AppRouter>({
//   links: [
//     // 一度のリクエストに3つのリクエストを含めることができる
//     httpBatchLink({
//       url: 'http://localhost:5000/trpc',
//     }),
//   ],
// });

// const Test = () => {
//   useEffect(() => {
//     const getHello = async () => {
//       const hellos = await Promise.all([
//         client.hello.query(),
//         client.hello.query(),
//         client.hello.query(),
//       ]);
//       console.log(hellos);
//     };
//     getHello();
//   }, []);

//   return <div>Test</div>;
// };

export default Test;
