// import React from 'react';
// import { useNavigate, Link } from 'react-router-dom';

// const Card = (props) => {
//   const navigate = useNavigate();

//   function handleNavigation() {
//     navigate(props.route);
//   }

//   return (
//     <div className={`w-full md:w-2/5 p-4 md:p-6 bg-cyan-200 ${props.className} duration-300`}>
//       <h3 className='text-xl md:text-3xl text-center mt-4 md:mt-8  font-raleway text-prett rounded-md border  bg-white p-2 md:py-5'>{props.heading}</h3>
//       <p className='text-center font-bold mt-3 font-raleway'>{props.data}</p>
//       <Link to={props.route}>
//         <button onClick={handleNavigation} className='mt-8 flex transition-all  md:mt-28 mx-auto px-4 md:px-6 py-2 rounded-md bg-slate-800 text-white hover:bg-slate-700'>
//           Start Quiz
//         </button>
//       </Link>
//     </div>
//   );
// };

// export default Card;

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Card = (props) => {
  const navigate = useNavigate();

  function handleNavigation() {
    navigate(props.route);
  }

  return (
    <div
      className={`
        w-full md:w-2/5 p-4 md:p-6
        ${props.className}      /* ← we’ll override bg here */
        duration-300
      `}
    >
      <h3
        className="
          text-xl md:text-3xl
          text-center mt-4 md:mt-8
          font-raleway text-prett
          rounded-md border bg-white p-2 md:py-5
        "
      >
        {props.heading}
      </h3>
      <p className="text-center font-bold mt-3 font-raleway">
        {props.data}
      </p>
      <Link to={props.route}>
        <button
          onClick={handleNavigation}
          className="
            mt-8 flex transition-all md:mt-28 mx-auto
            px-4 md:px-6 py-2 rounded-md
            bg-slate-800 text-white hover:bg-slate-700
          "
        >
          Start Quiz
        </button>
      </Link>
    </div>
  );
};

export default Card;
