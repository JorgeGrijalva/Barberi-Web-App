import React from "react";

export const ProductDetailLoading = ({ container }: { container?: boolean }) => (
  <div className={`p-5 animate-pulse mt-6 md:mt-0 ${container ? "xl:container px-2 md:px-4" : ""}`}>
    <div className="grid md:grid-cols-2 gap-7">
      <div
        className={`rounded-2xl  bg-gray-300 ${
          container ? "aspect-[690/724] max-h-[724px]" : " md:aspect-[411/609] aspect-[1/1.15]"
        }`}
      />
      <div className="mt-8">
        <table className="w-full">
          <thead />
          <tbody>
            <tr>
              <td>
                <div className="h-5 w-3/5 rounded-full bg-gray-300" />
              </td>
              <td className="w-9">
                <div className="h-5 w-full rounded-full bg-gray-300" />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="h-3 w-2/5 mt-2 rounded-full bg-gray-300" />
        <div className="h-7 w-full mt-5 rounded-full bg-gray-300" />
        <div className="h-7 w-4/5 mt-5 rounded-full bg-gray-300" />

        <div className="h-20 w-full mt-7 rounded-2xl bg-gray-300" />
        <div className="h-20 w-full mt-4 rounded-2xl bg-gray-300" />
      </div>
    </div>
  </div>
);
