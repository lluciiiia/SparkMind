'use client';

import Image from 'next/image';
import React from 'react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export interface LandingCardProps {
  title: string;
  description?: string;
  lists?: {
    list_title: string;
    list_description?: string;
  }[];
}

export const LandingCards = ({ cards }: { cards: LandingCardProps[] }) => {
  return (
    <section className="p-8 container mx-auto">
      <h2 className="text-[#003366] text-2xl text-center mb-4 w-full flex justify-flex-start items-center flex-col md:flex-row">
        Our &nbsp;{'('}
        <span className="relative inline-block mx-2">
          <Image
            src={'/assets/images/out_features.png'}
            alt="Home Feature 1"
            width={100}
            height={100}
          />
        </span>
        {')'}
        &nbsp;Features
      </h2>
      <BentoGrid
        className={`
          gap-8
        `}
      >
        {cards.map((card, index) => {
          const { title, description, lists } = card;
          let widthClass = 'md:col-span-1';
          if (index === 0 || index === 1) {
            widthClass = 'md:col-span-2';
          }
          return (
            <React.Fragment key={`${title}-${index}`}>
              <BentoGridItem
                className={`
                  bg-white rounded-lg shadow-md
                  p-4 ${widthClass}
                `}
                title={
                  <>
                    <p
                      className={`
                        text-[#003366] text-lg py-2 px-4 bg-[#cde1fa] rounded-full w-fit
                        
                      `}
                    >
                      <span
                        className={`
                          flex justify-flex-start items-center 
                          w-fit tracking-wider font-bold
                        `}
                      >
                        {index + 1}
                      </span>
                    </p>
                    <CardHeader className="text-lg">
                      {title && <CardTitle className="text-[#003366] text-xl">{title}</CardTitle>}
                      {description && (
                        <CardDescription className="text-[#202020]">{description}</CardDescription>
                      )}
                    </CardHeader>
                  </>
                }
                content={
                  <>
                    {lists && (
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {lists.map((list, listIndex) => {
                          const { list_title, list_description } = list;
                          return (
                            <ul
                              key={`${listIndex}-${list_title}`}
                              className="flex flex-col gap-2 list-disc list-inside"
                            >
                              <li
                                className={`
                                  text-[#003366]
                                  ${list_description ? 'flex flex-col gap-2' : ''}
                                `}
                              >
                                <span
                                  className={`
                                    text-[#003366] text-[17px] font-semibold
                                  `}
                                >
                                  {list_title}
                                </span>
                                {list_description && (
                                  <p
                                    className={`
                                      text-[#878788] text-base
                                    `}
                                  >
                                    {list_description}
                                  </p>
                                )}
                              </li>
                            </ul>
                          );
                        })}
                      </CardContent>
                    )}
                  </>
                }
              />
            </React.Fragment>
          );
        })}
      </BentoGrid>
    </section>
  );
};
