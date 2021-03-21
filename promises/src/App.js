import {useState} from 'react';

function App() {
  const [data, setData] = useState();
  const [error, setError] = useState();

  
  const handleClick = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => new Promise((resolve, reject) => {
        setTimeout(() => {
          setData(data);
          // resolve(2);
        }, 2000);
      }))
      .then((res) => console.log('After fetching!' + res))
      .catch(error => alert(error))
      .then(() => console.log('Fetching data error!'))
      .finally(() => console.log('End of operatins...'));
  }

  const handleFetchAll = () => {
    const urls = [
      'https://jsonplaceholder.typicode.com/users',
      'https://jsonplaceholder.typicode.com/posts'
    ];

    const requests = urls.map((url) => fetch(url));

    Promise.all(requests)
      .then(responses => responses)
      .then(responses => 
        responses.forEach((response) => new Promise(
          resolve => resolve(response.json())
        ).then(data => console.log(data)))
      )
      // .then((res) => console.log(res));

    console.log('requests: ', requests);
  };
  
  console.log('data: ', data);

  return (
    <div>
      <button onClick={handleClick}>Load data</button>
      <button onClick={handleFetchAll}>Fetch all</button>
      {data ? data.map((item) =>
        <p key={item.id}>{item.title}</p>
      ) : <p>{error}</p>
      }
    </div>
  );
}

export default App;
