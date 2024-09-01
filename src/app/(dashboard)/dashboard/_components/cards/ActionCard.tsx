'use client';

import type { ActionCardProps, Event } from '@/app/(dashboard)/dashboard/_components/interfaces';
import { createEvents } from '@/app/_api-handlers/api-handler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type React from 'react';
import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';

function isEvent(item: unknown): item is Event {
  return (
    typeof item === 'object' &&
    item !== null &&
    'summary' in item &&
    'description' in item &&
    'start' in item &&
    'end' in item
  );
}

const ActionCard: React.FC<ActionCardProps> = memo(({ learningId, actionItemsData }) => {
  const [todoList, setTodoList] = useState<Event[]>([]);
  const [selectedRowsidx, setSelectedRowsidx] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (actionItemsData === null || actionItemsData === undefined) {
      setTodoList([]);
      toast.error('No action items data available');
      return;
    }

    if (!Array.isArray(actionItemsData)) {
      setTodoList([]);
      toast.error('Invalid action items data format');
      return;
    }

    const validEvents = actionItemsData.filter(isEvent);

    if (validEvents.length === 0) {
      setTodoList([]);
      toast.warning('No valid action items found');
      return;
    }

    if (validEvents.length !== actionItemsData.length) {
      toast.warning('Some action items were invalid and have been filtered out');
    }

    setTodoList(validEvents);
  }, [actionItemsData]);

  const handleCreateEvent = async () => {
    if (!learningId) {
      toast.error('Learning ID is missing');
      return;
    }

    if (selectedRowsidx.length === 0) {
      toast.error('No tasks selected');
      return;
    }

    setIsLoading(true);
    try {
      const selectedTask = selectedRowsidx.map((rowIndex) => {
        const item = todoList[rowIndex];
        if (!item) throw new Error(`Invalid item at index ${rowIndex}`);
        return {
          summary: item.summary || 'Untitled Task',
          description: item.description || '',
          start: item.start,
          end: item.end,
        };
      });

      const response = await createEvents(selectedTask, learningId);
      if (response?.data?.status === 200) {
        toast.success('Events created successfully');
        setSelectedRowsidx([]);
      } else {
        toast.error(`Error creating events: ${response?.data?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error creating events: ${(err as Error).message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedRowsidx((prevSelectedRows) =>
      prevSelectedRows.includes(index)
        ? prevSelectedRows.filter((row) => row !== index)
        : [...prevSelectedRows, index],
    );
  };

  return (
    <Card className="w-full h-[calc(100vh-200px)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Action Items</CardTitle>
        <Button onClick={handleCreateEvent} disabled={isLoading || selectedRowsidx.length === 0}>
          {isLoading ? 'Creating...' : 'Create Selected Tasks'}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          {todoList.length > 0 ? (
            todoList.map((item, index) => (
              <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                <div className="flex items-center mb-2">
                  <Checkbox
                    checked={selectedRowsidx.includes(index)}
                    onCheckedChange={() => handleCheckboxChange(index)}
                  />
                  <span className="ml-2 text-sm">
                    {new Date(item.start.dateTime).toLocaleString()} -{' '}
                    {new Date(item.end.dateTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <Input
                  value={item.summary || ''}
                  onChange={(e) =>
                    setTodoList((prev) =>
                      prev.map((t, i) => (i === index ? { ...t, summary: e.target.value } : t)),
                    )
                  }
                  className="mb-2"
                  placeholder="Task summary"
                />
                <Textarea
                  value={item.description || ''}
                  onChange={(e) =>
                    setTodoList((prev) =>
                      prev.map((t, i) => (i === index ? { ...t, description: e.target.value } : t)),
                    )
                  }
                  className="mb-2"
                  placeholder="Task description"
                />
                <Select
                  value={item.start?.timeZone || ''}
                  onValueChange={(value) =>
                    setTodoList((prev) =>
                      prev.map((t, i) =>
                        i === index ? { ...t, start: { ...t.start, timeZone: value } } : t,
                      ),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Calcutta">Asia/Calcutta</SelectItem>
                    <SelectItem value="America/Los_Angeles">PST</SelectItem>
                    <SelectItem value="America/Chicago">CST</SelectItem>
                    <SelectItem value="America/New_York">EST</SelectItem>
                    <SelectItem value="GMT">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No action items found. Please ensure you have calendar access and have uploaded a
              video.
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

ActionCard.displayName = 'ActionCard';

export default ActionCard;
