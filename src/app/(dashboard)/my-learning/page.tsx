'use client';

import { ContentLayout } from '@/components';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePersistedId } from '@/hooks';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';
import { AlertCircle, Edit, Eye, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Cards = {
  id: string;
  index: number;
  title: string;
  input: string;
  date: string;
};

export const MyLearning = () => {
  const router = useRouter();
  const {
    id: mylearning_id,
    clearId: clearMyLearningId,
    setPersistedId,
    generateNewId,
  } = usePersistedId('mylearning_id');

  const [cards, setCards] = useState<Cards[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currTitle, setCurrTitle] = useState<string>('');
  const [currInput, setCurrInput] = useState<string>('');
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const [originalCards, setOriginalCards] = useState<Cards[]>([]);
  const [isDateSorted, setIsDateSorted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [colorMap, setColorMap] = useState<Map<number, string>>(new Map<number, string>());
  const [showAlert, setShowAlert] = useState(true);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const supabaseClient = createClient();

  //DB Storage date
  const dateFormatter = (date: Date) => {
    const formattedDate =
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2);
    const formattedTime =
      ('0' + date.getHours()).slice(-2) +
      ':' +
      ('0' + date.getMinutes()).slice(-2) +
      ':' +
      ('0' + date.getSeconds()).slice(-2);
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
  };

  function assignColors(cards: any[], colorMap: Map<number, string>): Map<number, string> {
    const colors = ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100'];
    cards.forEach((card, index) => {
      if (!colorMap.has(index)) {
        colorMap.set(index, colors[index % colors.length]);
      }
    });
    return colorMap;
  }

  useEffect(() => {
    setColorMap(assignColors(cards, colorMap));
  }, [cards]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabaseClient = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        throw new Error('Failed to authenticate user');
      }

      if (!user || !user.id) {
        console.error('User ID not found');
        clearMyLearningId();
        throw new Error('User ID not returned from Supabase');
      }

      const res = await axios.get(`/api/v1/learnings?userId=${user.id}`);

      if (res.status !== 200) {
        console.error('API response error:', res.status, res.statusText);
        throw new Error(`API returned status ${res.status}`);
      }

      if (!Array.isArray(res.data.body)) {
        console.error('Unexpected API response format:', res.data);
        throw new Error('Unexpected API response format');
      }

      if (res.data.body.length === 0) {
        setCards([]);
        setOriginalCards([]);
        toast.info('No learning data found for user');
        return;
      }

      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      };

      const formattedCards = res.data.body.map((card: any, index: number) => ({
        ...card,
        date: new Date(card.date).toLocaleDateString('en-GB', options),
        index: index,
      }));

      setCards(formattedCards);
      setOriginalCards(formattedCards);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error instanceof Error) {
        toast.error(`Failed to load data: ${error.message}`);
      } else {
        toast.error('An unexpected error occurred while fetching data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearMyLearningId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string | null) => {
    try {
      if (id !== null) {
        const uuid = (await supabaseClient.auth.getUser()).data.user?.id as string;

        if (!uuid) {
          clearMyLearningId();
          throw new Error('User ID not returned from superbase');
        }
        const response = await axios.delete('/api/v1/learnings', {
          data: { id, uuid },
        });

        if (response.status === 200) {
          setCards((cards) => cards.filter((card) => card.id !== id));
          setOriginalCards((cards) => cards.filter((card) => card.id !== id));
          setIsDialogOpen(false);
        } else {
          toast.error('Error deleting My leaning data:', response.data.body);
        }
      }
    } catch (error) {
      throw new Error('Error when Delete my learning : ' + (error as Error).message);
    }
  };

  function parseDateUTC(dateString: string): Date {
    const [day, month, year] = dateString.split(' ');
    const monthIndex = new Date(Date.parse(month + ' 1, 2012')).getMonth();
    return new Date(Date.UTC(Number(year), monthIndex, Number(day)));
  }

  function handleEdit(id: string): void {
    const filteredCard = cards.find((card) => card.id === id);
    if (filteredCard) {
      const parsedDate = parseDateUTC(filteredCard?.date);
      setCurrTitle(filteredCard?.title || '');
      setCurrInput(filteredCard?.input || '');
      setCurrDate(parsedDate);
      setEditingCardId(id);
      setIsDialogOpen(true);
    }
  }

  const handleSaveCard = async (card: Cards) => {
    try {
      const supabaseClient = createClient();

      const userId = (await supabaseClient.auth.getUser()).data.user?.id as string;

      if (!userId) throw new Error('User ID not returned from Supabase');

      const response = await axios.patch('/api/v1/learnings', {
        id: card.id,
        title: card.title,
        input: card.input,
        date: card.date,
        uuid: userId,
      });

      const options = {
        day: 'numeric' as const,
        month: 'short' as const,
        year: 'numeric' as const,
      };
      const DateDisplay = new Date(card.date).toLocaleDateString('en-GB', options);

      const updatedCard = { ...card, date: DateDisplay };

      if (response.status === 200) {
        setCards(cards.map((c) => (c.id === card.id ? updatedCard : c)));
        setOriginalCards(cards.map((c) => (c.id === card.id ? updatedCard : c)));
        fetchData();
      } else {
        throw new Error('Error updating data: ' + response.data.body);
      }
    } catch (error) {
      console.error('Error updating my learning:', error);
      throw error;
    }
  };

  const saveChanges = async () => {
    if (editingCardId !== null) {
      const cardToUpdate = cards.find((c) => c.id === editingCardId) as Cards;

      const updatedCard = {
        id: editingCardId,
        index: cardToUpdate?.index,
        title: currTitle,
        input: currInput,
        date: dateFormatter(currDate).toString(),
      };

      try {
        await handleSaveCard(updatedCard);
        toast.success('Changes saved successfully');
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Error saving changes:', error);
        toast.error('Failed to save changes. Please try again.');
      }
    }
  };

  const cancelChanges = () => {
    setCurrDate(new Date());
    setCurrTitle(cards.find((c) => c.id === editingCardId)?.title || '');
    setCurrInput(cards.find((c) => c.id === editingCardId)?.input || '');
    setIsDialogOpen(false);
  };

  const redirectToMyLearningPage = (id: string) => {
    setPersistedId(id);
    window.open(`/dashboard?mylearning_id=${id}`, '_self');
  };

  const helpfulNotes: string[] = [
    'Changing the title does not change the context generated in the outputs section.',
    'Your learning cards are automatically color-coded for easy identification.',
    'You can sort your cards by date or keep them in the order you created them.',
    'You can delete a card by clicking the delete button, after pressing the edit button.',
  ];

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedCards = isDateSorted
    ? [...filteredCards].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : filteredCards;

  return (
    <ContentLayout title="My Learning">
      <Breadcrumb className="flex flex-row items-center justify-between mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Learning</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container mx-auto">
        {showAlert && (
          <Alert variant="default" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Helpful Notes</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside">
                {helpfulNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAlert(false)}
              className="mt-2"
            >
              Dismiss
            </Button>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Learning</h1>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-4 h-4 bg-black rounded-full" />
          <div className="flex-grow h-0.5 bg-black" />
        </div>
        <Tabs
          defaultValue={isDateSorted ? 'date' : 'recent'}
          onValueChange={(value) => setIsDateSorted(value === 'date')}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="date">Date</TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8 pr-4">
            <Card className="flex items-center justify-center h-48 border-2 border-dashed border-blue-300 bg-blue-50">
              <Button
                variant="ghost"
                className="h-full w-full"
                onClick={() => {
                  const newId = generateNewId();
                  toast.info('Redirecting to new learning card');
                  window.open(`/new?mylearning_id=${newId}`, '_self');
                }}
              >
                <Plus className="h-6 w-6 text-blue-500" />
              </Button>
            </Card>
            {sortedCards.map((card) => (
              <LearningCard
                key={card.id}
                title={card.title}
                date={card.date}
                input={card.input}
                onEdit={() => handleEdit(card.id)}
                handleDashboardScreen={() => redirectToMyLearningPage(card.id)}
              />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
            <DialogDescription>
              Make changes to your Learning here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titleinput" className="text-right">
                Title
              </Label>
              <Input
                type="text"
                id="titleinput"
                value={currTitle || ''}
                className="col-span-3"
                onChange={(e) => setCurrTitle(e.target.value)}
              />
              <Label htmlFor="input" className="text-right">
                Input
              </Label>
              <Input
                type="text"
                id="input"
                value={currInput || ''}
                className="col-span-3"
                onChange={(e) => setCurrInput(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateinput" className="text-right">
                Date
              </Label>
              <Input
                type="date"
                id="dateinput"
                value={currDate ? currDate.toISOString().substring(0, 10) : ''}
                className="col-span-3"
                onChange={(e) => setCurrDate(new Date(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex justify-between">
              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-900 text-white"
                onClick={() => handleDelete(editingCardId)}
              >
                Delete
              </Button>
              <div>
                <Button type="button" className="mr-2" onClick={cancelChanges}>
                  Cancel
                </Button>
                <Button type="submit" onClick={saveChanges}>
                  Save changes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-20 z-50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 " />
        </div>
      )}
    </ContentLayout>
  );
};

const LearningCard = ({
  title,
  date,
  input,
  onEdit,
  handleDashboardScreen,
}: {
  title: string;
  date: string;
  input: string;
  onEdit: () => void;
  handleDashboardScreen: () => void;
}) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const bgColors: string[] = [
    'bg-yellow-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-pink-100',
    'bg-purple-100',
  ];
  const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  return (
    <Card
      className={`relative h-48 ${bgColor} hover:shadow-lg transition-shadow duration-300 ease-in-out`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <CardContent className="flex flex-col justify-between h-full p-4">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{input}</p>
        <p className="text-sm text-gray-600">{date}</p>
      </CardContent>
      {isHover && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-b-xl">
          <Button variant="secondary" className="mr-2" onClick={handleDashboardScreen}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="secondary" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MyLearning;
