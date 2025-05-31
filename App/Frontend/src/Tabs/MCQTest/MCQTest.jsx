import React from "react";
import Card from "../../component/Card/Card";

const MCQTest = () => {
  return (
    <div
      className="
      fixed flex items-center m-auto justify-center
      h-screen w-full p-8 md:p-32
      bg-neutral-900
    "
    >
      <div
        className="
        flex flex-col md:flex-row gap-7
        justify-center h-2/3 w-full mt-14
      "
      >
        <Card
          className="
            bg-gradient-to-tr from-indigo-600 to-blue-400
            rounded-lg shadow-lg shadow-black/50
            border border-indigo-700
          "
          heading={"Prepare CS fundamentals"}
          data={"Top 20 Most Asked MCQs"}
          route={"/mcqtest/CS_fundamentals"}
        />

        <Card
          className="
            bg-gradient-to-tr from-teal-500 to-emerald-400
            rounded-lg shadow-lg shadow-black/50
            border border-teal-600
          "
          heading={"Master DSA fundamentals"}
          data={"Top 20 Most Asked MCQs"}
          route={"/mcqtest/DSA_fundamentals"}
        />

        <Card
          className="
            bg-gradient-to-tr from-rose-500 to-pink-400
            rounded-lg shadow-lg shadow-black/50
            border border-rose-600
          "
          heading={"Crack Online Assessment"}
          data={"Top 20 Most Asked MCQs on CS Fundamentals"}
          route={"/mcqtest/Online_Assessment"}
        />
      </div>
    </div>
  );
};

export default MCQTest;
