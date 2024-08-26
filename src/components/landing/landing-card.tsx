'use client'

import React from 'react'
import { Card, CardTitle, CardContent ,CardHeader, CardDescription } from '../ui/card'

interface LandingCardProps
{
  title: string;
  description?: string
  lists?: {
    list_title: string;
    list_description?: string
  }[]
}

export const LandingCards = ({ cards }: { cards: LandingCardProps[] }) => {
  return (
    <>
      {cards.map((
        {card, index}:
        {
          card: LandingCardProps,
          index: string | number
        }) => {
        const { title, description, lists } = card
        return (
          <>
            <Card
              key={title}
              className={`
                p-2
              `}
            >
              <span
                classsName={`
                  rounded-full p-4 text-lg
                `}
              >
                {index}
              </span>
              <CardHeader
                className={`
                  text-lg
                `}
              >
                {title && (
                  <CardTitle>
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <CardDescription>
                    {description}
                  </CardDescription
                )}
              </CardHeader>
              {lists && (
                <CardContent>
                  {lists.map((
                    {
                      list, index
                    }:{
                      index: string | number
                    }) => {
                    const { list_title, list_description } = list
                    return (
                      <>
                        <ul
                          key={`${index}-${list_title}`}
                          className={`
                            flex flex-col gap-2
                          `}
                        >
                          <li>
                            <span>
                              {list_title}
                            </span>
                              {list_description && (
                                <p>
                                  {list_description}
                                </p>
                              )}
                          </li>
                        </ul>
                      </>
                    )
                  })}
                </CardContent>
              )}
            </Card>
          </>
        )
      })}
    </>
  )
}
