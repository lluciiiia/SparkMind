'use client'

import { useState, useEffect } from 'react'
import { useQueryState } from 'nuqs'
import { format } from 'date-fns'
import { marked } from 'marked'
import { Slugify } from '@/utils'
import type { OutputSchema } from '@/schema/scrape'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'

const MAX_TITLE_LENGTH = 100 // Adjust this value as needed

export function Recent({ recent }: { recent: OutputSchema[] }) {
  const [currentSlide, setCurrentSlide] = useQueryState('recent', {
    parse: Slugify,
    defaultValue: Slugify(recent[0].output_id),
    clearOnDefault: false,
  })
  const [currIndex, setCurrIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [showFullTitle, setShowFullTitle] = useState(false)

  useEffect(() => {
    const index = recent.findIndex(item => Slugify(item.output_id) === currentSlide)
    setCurrIndex(index !== -1 ? index : 0)
  }, [currentSlide, recent])

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const text = await marked(recent[currIndex].text_output)
        setContent(text)
      } catch (error) {
        toast.error('Failed to fetch content')
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [currIndex, recent])

  const handleNext = () => {
    if (currIndex < recent.length - 1) {
      setCurrentSlide(Slugify(recent[currIndex + 1].output_id))
    }
  }

  const handlePrev = () => {
    if (currIndex > 0) {
      setCurrentSlide(Slugify(recent[currIndex - 1].output_id))
    }
  }

  const toggleTitleDisplay = () => {
    setShowFullTitle(!showFullTitle)
  }

  const renderTitle = () => {
    const title = recent[currIndex].prompt_name
    if (title.length <= MAX_TITLE_LENGTH) {
      return <CardTitle className="text-2xl font-bold">{title}</CardTitle>
    }

    return (
      <div>
        <CardTitle className="text-2xl font-bold">
          {showFullTitle ? title : `${title.slice(0, MAX_TITLE_LENGTH)}...`}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-muted-foreground"
          onClick={toggleTitleDisplay}
        >
          {showFullTitle ? (
            <>
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8 px-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <Card className="w-full">
        <CardHeader className="space-y-0 pb-2">
          <div className="flex flex-row items-center justify-between">
            {renderTitle()}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                disabled={currIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currIndex === recent.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <p>Created: {format(new Date(recent[currIndex].created_at), 'PPP')}</p>
          <p>Updated: {format(new Date(recent[currIndex].updated_at), 'PPP')}</p>
        </CardFooter>
      </Card>
    </div>
  )
}