import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Calendar, Users, Plus, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

const discussionTopics = [
  {
    id: '1',
    title: 'Best practices for organic pest control',
    author: 'Maria Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=150&h=150',
    date: '2 days ago',
    replies: 24,
    likes: 45,
    category: 'Organic Farming'
  },
  {
    id: '2',
    title: 'Water conservation techniques during dry season',
    author: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=150&h=150',
    date: '5 days ago',
    replies: 18,
    likes: 32,
    category: 'Water Management'
  },
  {
    id: '3',
    title: 'Recommended crop rotation for small farms',
    author: 'Sarah Thompson',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=150&h=150',
    date: '1 week ago',
    replies: 36,
    likes: 27,
    category: 'Crop Management'
  },
  {
    id: '4',
    title: 'Local seed varieties adaptable to climate change',
    author: 'Robert Chen',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=150&h=150',
    date: '2 weeks ago',
    replies: 42,
    likes: 64,
    category: 'Seeds & Planting'
  }
];

const events = [
  {
    id: '1',
    title: 'Annual Farmers Market',
    date: 'June 15, 2024',
    location: 'Central Community Square',
    attendees: 45,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: '2',
    title: 'Sustainable Farming Workshop',
    date: 'July 10, 2024',
    location: 'Agricultural Extension Office',
    attendees: 28,
    image: 'https://images.unsplash.com/photo-1577590835286-1cdd24c08fd5?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: '3',
    title: 'Crop Disease Prevention Seminar',
    date: 'August 5, 2024',
    location: 'Community College - Room 102',
    attendees: 32,
    image: 'https://images.unsplash.com/photo-1593935856808-e084a1edf60b?auto=format&fit=crop&q=80&w=500'
  }
];

const groups = [
  {
    id: '1',
    name: 'Organic Farmers Collective',
    members: 124,
    activity: 'Very Active',
    image: 'https://images.unsplash.com/photo-1585666749483-7b7486184946?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: '2',
    name: 'Small Farm Technology Group',
    members: 87,
    activity: 'Active',
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: '3',
    name: 'Sustainable Water Management',
    members: 56,
    activity: 'Moderately Active',
    image: 'https://images.unsplash.com/photo-1586861256632-f743a7659aeb?auto=format&fit=crop&q=80&w=500'
  }
];

const Community = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="bg-neutral py-12 md:py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('community.title')}</h1>
            <p className="text-lg text-gray-600">
              {t('community.subtitle')}
            </p>
          </div>
          
          <Tabs defaultValue="discussions" className="w-full">
            <div className="bg-white rounded-xl overflow-hidden mb-8">
              <TabsList className="w-full h-auto p-0 bg-white border-b">
                <TabsTrigger 
                  value="discussions" 
                  className="flex-1 py-4 px-6 data-[state=active]:bg-neutral rounded-none"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t('community.discussions')}
                </TabsTrigger>
                <TabsTrigger 
                  value="events" 
                  className="flex-1 py-4 px-6 data-[state=active]:bg-neutral rounded-none"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('community.events')}
                </TabsTrigger>
                <TabsTrigger 
                  value="groups" 
                  className="flex-1 py-4 px-6 data-[state=active]:bg-neutral rounded-none"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t('community.groups')}
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Discussions Tab */}
            <TabsContent value="discussions" className="mt-0">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{t('community.recentDiscussions')}</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('community.newTopic')}
                </Button>
              </div>
              
              <div className="space-y-4">
                {discussionTopics.map(topic => (
                  <div key={topic.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img src={topic.avatar} alt={topic.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold">{topic.author}</p>
                          <p className="text-sm text-gray-500">{topic.date}</p>
                        </div>
                        <div className="ml-auto">
                          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                            {topic.category}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-4">{topic.title}</h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <div className="flex items-center mr-4">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{topic.likes}</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{topic.replies} {t('community.replies')}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Events Tab */}
            <TabsContent value="events" className="mt-0">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{t('community.upcomingEvents')}</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('community.createEvent')}
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 relative">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <div className="mb-3">
                        <p className="text-gray-600">
                          <span className="font-medium">{t('community.date')}:</span> {event.date}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">{t('community.location')}:</span> {event.location}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {event.attendees} {t('community.attending')}
                        </span>
                        <Button size="sm">{t('community.viewDetails')}</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Groups Tab */}
            <TabsContent value="groups" className="mt-0">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{t('community.farmerGroups')}</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('community.createGroup')}
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                  <div key={group.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 relative">
                      <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                      <div className="mb-4">
                        <p className="text-gray-600">
                          <span className="font-medium">Members:</span> {group.members}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Activity:</span>{' '}
                          <span className={`${
                            group.activity === 'Very Active' 
                              ? 'text-green-600' 
                              : group.activity === 'Active' 
                              ? 'text-blue-600'
                              : 'text-orange-600'
                          }`}>
                            {group.activity}
                          </span>
                        </p>
                      </div>
                      <Button className="w-full">{t('community.joinGroup')}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
