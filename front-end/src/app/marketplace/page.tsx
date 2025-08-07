'use client';

import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import { getPosts, getCategories, Post, GetPostsFilters } from '../../gateway/marketplace';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  HStack, 
  Avatar, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem,
  Input,
  Select,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
  Tooltip,
  useToast,
  Grid,
  GridItem,
  Container,
  Heading,
  useColorModeValue,
  Card,
  CardBody,
  Image,
  Progress,
  Divider,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { 
  SearchIcon, 
  AddIcon, 
  StarIcon, 
  ViewIcon,
  SettingsIcon,
  ChatIcon
} from '@chakra-ui/icons';
import './card-effects.css';

// Ícone para troca
const TradeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 14.707a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L8 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5z" clipRule="evenodd" />
  </svg>
);

export default function MarketplacePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const toast = useToast();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GetPostsFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'rarity'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Opções de filtro estáticas
  const rarities = [
    { value: 'Common', label: 'Comum', color: 'gray', icon: '⭐' },
    { value: 'Uncommon', label: 'Incomum', color: 'green', icon: '⭐⭐' },
    { value: 'Rare', label: 'Raro', color: 'blue', icon: '⭐⭐⭐' },
    { value: 'Epic', label: 'Épico', color: 'purple', icon: '⭐⭐⭐⭐' },
    { value: 'Legendary', label: 'Lendário', color: 'yellow', icon: '⭐⭐⭐⭐⭐' }
  ];
  
  const conditions = [
    { value: 'New', label: 'Novo', color: 'green' },
    { value: 'Used', label: 'Usado', color: 'blue' },
    { value: 'Good', label: 'Bom', color: 'teal' },
    { value: 'Fair', label: 'Justo', color: 'orange' },
    { value: 'Poor', label: 'Ruim', color: 'red' }
  ];

  // Cores do tema
  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const cardBg = useColorModeValue('gray.800', 'gray.800');
  const textColor = useColorModeValue('white', 'white');
  const borderColor = useColorModeValue('gray.600', 'gray.600');
  const primaryColor = '#3B82F6';
  const accentColor = '#10B981';

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, [filters, sortBy]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const postsData = await getPosts(filters);
      
      // Ordenar posts
      const sortedPosts = [...postsData].sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return a.price - b.price;
          case 'date':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'rarity':
            const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5 };
            return rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder];
          default:
            return 0;
        }
      });
      
      setPosts(sortedPosts);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar anúncios');
      toast({
        title: "Erro",
        description: err.message || "Erro ao carregar anúncios",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (filterName: keyof GetPostsFilters, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSortBy('date');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getRarityClass = (rarity: string) => {
    const rarityMap: Record<string, string> = {
      'Common': 'rarity-common',
      'Uncommon': 'rarity-uncommon',
      'Rare': 'rarity-rare',
      'Epic': 'rarity-epic',
      'Legendary': 'rarity-legendary'
    };
    return rarityMap[rarity] || 'rarity-common';
  };

  const getRarityColor = (rarity: string) => {
    const colorMap: Record<string, string> = {
      'Common': 'gray',
      'Uncommon': 'green',
      'Rare': 'blue',
      'Epic': 'purple',
      'Legendary': 'yellow'
    };
    return colorMap[rarity] || 'gray';
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleCreatePost = () => {
    router.push('/marketplace/new');
  };

  const handleViewPost = (postId: string) => {
    router.push(`/marketplace/item/${postId}`);
  };

  const handleQuickView = (post: Post) => {
    setSelectedPost(post);
    onOpen();
  };

  const getStats = () => {
    const totalValue = posts.reduce((sum, post) => sum + post.price, 0);
    const avgPrice = posts.length > 0 ? totalValue / posts.length : 0;
    const legendaryCount = posts.filter(post => post.rarity === 'Legendary').length;
    
    return { totalValue, avgPrice, legendaryCount };
  };

  const stats = getStats();

  return (
    <Box minH="100vh" bg={bgColor} color={textColor} fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      {/* Background Pattern */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.05}
        backgroundImage="url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22 width=%2280%22 height=%2280%22%3E%3Cpath fill=%22%233B82F6%22 fill-opacity=%220.3%22 d=%22M0 0h80v80H0zM20 20h40v40H20z%22/%3E%3C/svg%3E')"
        zIndex={-1}
      />

      {/* Navigation Header */}
      <Box bg={cardBg} borderBottom="1px" borderColor={borderColor} px={8} py={4} position="sticky" top={0} zIndex={10}>
        <Flex justify="space-between" align="center" maxW="7xl" mx="auto">
          <HStack spacing={4}>
            <Heading size="lg" color={primaryColor} cursor="pointer" onClick={() => router.push('/marketplace')}>
              🎮 Game Community
            </Heading>
          </HStack>
          
          <HStack spacing={4}>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/marketplace')}
              colorScheme="blue"
              leftIcon={<ViewIcon />}
              _hover={{ bg: 'blue.600', color: 'white' }}
            >
              Marketplace
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/chat/private')}
              colorScheme="blue"
              leftIcon={<ChatIcon />}
              _hover={{ bg: 'blue.600', color: 'white' }}
            >
              Chat
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/profile/preferences')}
              colorScheme="blue"
              _hover={{ bg: 'blue.600', color: 'white' }}
            >
              Perfil
            </Button>
            
            <Menu>
              <MenuButton as={Button} variant="ghost" rightIcon={<Avatar size="sm" name={user?.name} />}>
                {user?.name}
              </MenuButton>
              <MenuList bg={cardBg} borderColor={borderColor}>
                <MenuItem icon={<SettingsIcon />} onClick={() => router.push('/profile/preferences')} _hover={{ bg: 'gray.700' }}>
                  Preferências
                </MenuItem>
                <MenuItem onClick={handleLogout} _hover={{ bg: 'gray.700' }}>
                  Sair
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      <Container maxW="7xl" py={8}>
        {/* Header Section */}
        <Box mb={8}>
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading size="2xl" color={primaryColor} mb={2} fontWeight="bold">
                🛍️ Gamer&apos;s Marketplace
              </Heading>
              <Text color="gray.400" fontSize="lg" fontWeight="medium">
                Descubra tesouros únicos da comunidade gamer
              </Text>
            </Box>
            <Button
              onClick={handleCreatePost}
              colorScheme="blue"
              size="lg"
              leftIcon={<AddIcon />}
              _hover={{ transform: 'scale(1.05)', bg: '#2563EB' }}
              transition="all 0.2s"
              bg={primaryColor}
              fontWeight="semibold"
            >
              Criar Anúncio
            </Button>
          </Flex>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color="gray.400">Total de Itens</StatLabel>
                  <StatNumber color={primaryColor}>{posts.length}</StatNumber>
                  <StatHelpText color="gray.500">Anúncios ativos</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color="gray.400">Valor Total</StatLabel>
                  <StatNumber color={accentColor}>{formatPrice(stats.totalValue)}</StatNumber>
                  <StatHelpText color="gray.500">Soma dos preços</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color="gray.400">Itens Lendários</StatLabel>
                  <StatNumber color="yellow.400">{stats.legendaryCount}</StatNumber>
                  <StatHelpText color="gray.500">Raridade máxima</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>

        {/* Search and Filters */}
        <Card bg={cardBg} border="1px" borderColor={borderColor} shadow="xl" mb={8}>
          <CardBody p={6}>
            <VStack spacing={6} align="stretch">
              {/* Search Bar */}
              <Flex gap={4}>
                <Input
                  placeholder="🔍 Buscar por nome, categoria ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  size="lg"
                  bg="gray.700"
                  borderColor={borderColor}
                  color="white"
                  _hover={{ borderColor: primaryColor }}
                  _focus={{ bg: 'gray.600', borderColor: primaryColor }}
                  _placeholder={{ color: 'gray.400' }}
                />
                <Button
                  onClick={handleSearch}
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<SearchIcon />}
                  bg={primaryColor}
                  _hover={{ bg: '#2563EB' }}
                >
                  Buscar
                </Button>
              </Flex>

              {/* Filter Controls */}
              <Flex justify="space-between" align="center">
                <HStack spacing={4}>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    colorScheme="blue"
                    size="sm"
                  >
                    {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                  </Button>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'solid' : 'outline'}
                      onClick={() => setViewMode('grid')}
                      colorScheme="blue"
                    >
                      Grid
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'list' ? 'solid' : 'outline'}
                      onClick={() => setViewMode('list')}
                      colorScheme="blue"
                    >
                      Lista
                    </Button>
                  </HStack>
                </HStack>
                <Text fontSize="sm" color="gray.400">
                  {posts.length} item{posts.length !== 1 ? 's' : ''} encontrado{posts.length !== 1 ? 's' : ''}
                </Text>
              </Flex>

              {/* Filters */}
              {showFilters && (
                <Box>
                  <Divider mb={4} />
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">Categoria</Text>
                      <Select
                        value={filters.category || ''}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        bg="gray.700"
                        borderColor={borderColor}
                        color="white"
                        _hover={{ borderColor: primaryColor }}
                        _focus={{ bg: 'gray.600', borderColor: primaryColor }}
                      >
                        <option value="" style={{ backgroundColor: '#374151' }}>Todas as categorias</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat} style={{ backgroundColor: '#374151' }}>{cat}</option>
                        ))}
                      </Select>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">Raridade</Text>
                      <Select
                        value={filters.rarity || ''}
                        onChange={(e) => handleFilterChange('rarity', e.target.value)}
                        bg="gray.700"
                        borderColor={borderColor}
                        color="white"
                        _hover={{ borderColor: primaryColor }}
                        _focus={{ bg: 'gray.600', borderColor: primaryColor }}
                      >
                        <option value="" style={{ backgroundColor: '#374151' }}>Todas as raridades</option>
                        {rarities.map(rarity => (
                          <option key={rarity.value} value={rarity.value} style={{ backgroundColor: '#374151' }}>
                            {rarity.icon} {rarity.label}
                          </option>
                        ))}
                      </Select>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">Condição</Text>
                      <Select
                        value={filters.condition || ''}
                        onChange={(e) => handleFilterChange('condition', e.target.value)}
                        bg="gray.700"
                        borderColor={borderColor}
                        color="white"
                        _hover={{ borderColor: primaryColor }}
                        _focus={{ bg: 'gray.600', borderColor: primaryColor }}
                      >
                        <option value="" style={{ backgroundColor: '#374151' }}>Todas as condições</option>
                        {conditions.map(cond => (
                          <option key={cond.value} value={cond.value} style={{ backgroundColor: '#374151' }}>
                            {cond.label}
                          </option>
                        ))}
                      </Select>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">Ordenar por</Text>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'price' | 'date' | 'rarity')}
                        bg="gray.700"
                        borderColor={borderColor}
                        color="white"
                        _hover={{ borderColor: primaryColor }}
                        _focus={{ bg: 'gray.600', borderColor: primaryColor }}
                      >
                        <option value="date" style={{ backgroundColor: '#374151' }}>Mais recentes</option>
                        <option value="price" style={{ backgroundColor: '#374151' }}>Menor preço</option>
                        <option value="rarity" style={{ backgroundColor: '#374151' }}>Raridade</option>
                      </Select>
                    </Box>
                  </Grid>

                  <Flex justify="end" mt={4}>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      colorScheme="gray"
                      size="sm"
                    >
                      Limpar Filtros
                    </Button>
                  </Flex>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert status="error" mb={6} borderRadius="md" bg="red.900" color="white">
            <AlertIcon />
            <Box>
              <AlertTitle>Erro!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box textAlign="center" py={12}>
            <Spinner size="xl" color={primaryColor} mb={4} />
            <Text fontSize="lg" color="gray.400" fontWeight="medium">Carregando tesouros...</Text>
            <Progress size="sm" colorScheme="blue" mt={4} isIndeterminate />
          </Box>
        ) : (
          /* Posts Grid/List */
          <Box>
            {posts.length > 0 ? (
              viewMode === 'grid' ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                  spacing={6}
                >
                  {posts.map((post) => (
                    <Tilt key={post.post_id} tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000}>
                      <Card
                        className={`marketplace-card ${getRarityClass(post.rarity)}`}
                        bg={cardBg}
                        border="1px"
                        borderColor={borderColor}
                        shadow="xl"
                        overflow="hidden"
                        _hover={{
                          transform: 'translateY(-8px) scale(1.02)',
                          shadow: '2xl',
                          borderColor: primaryColor
                        }}
                        transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                        cursor="pointer"
                        onClick={() => handleViewPost(post.post_id)}
                      >
                        {/* Image Container */}
                        <Box position="relative" h="200px" className="card-image">
                          <Image
                            src={post.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                            alt={post.title}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            fallbackSrc="https://via.placeholder.com/300x200?text=Image+Error"
                          />
                          <Box className="card-sheen" />
                          {post.tradeable && (
                            <Tooltip label="Aceita Troca" placement="top" bg={primaryColor} color="white">
                              <Box
                                position="absolute"
                                top={3}
                                right={3}
                                bg={primaryColor}
                                p={2}
                                rounded="full"
                                shadow="md"
                              >
                                <TradeIcon />
                              </Box>
                            </Tooltip>
                          )}
                          <Button
                            position="absolute"
                            top={3}
                            left={3}
                            size="sm"
                            colorScheme="blue"
                            variant="solid"
                            opacity={0}
                            _groupHover={{ opacity: 1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickView(post);
                            }}
                          >
                            👁️
                          </Button>
                        </Box>

                        {/* Content */}
                        <CardBody p={5}>
                          {/* Badges */}
                          <Flex justify="space-between" align="center" mb={3}>
                            <Badge colorScheme={getRarityColor(post.rarity)} variant="solid" fontSize="sm">
                              {rarities.find(r => r.value === post.rarity)?.icon} {post.rarity}
                            </Badge>
                            <Badge colorScheme="gray" variant="outline" fontSize="sm">
                              {post.condition}
                            </Badge>
                          </Flex>

                          {/* Title and Description */}
                          <Heading size="md" color="white" mb={2} noOfLines={1} fontWeight="bold">
                            {post.title}
                          </Heading>
                          <Text fontSize="sm" color="gray.400" mb={4} noOfLines={2}>
                            {post.description}
                          </Text>

                          {/* Price and Action */}
                          <Flex justify="space-between" align="center">
                            <Text fontSize="xl" fontWeight="bold" color={primaryColor}>
                              {formatPrice(post.price)}
                            </Text>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="solid"
                              bg={primaryColor}
                              _hover={{ bg: '#2563EB' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewPost(post.post_id);
                              }}
                            >
                              Ver Detalhes
                            </Button>
                          </Flex>
                        </CardBody>
                      </Card>
                    </Tilt>
                  ))}
                </SimpleGrid>
              ) : (
                /* List View */
                <VStack spacing={4} align="stretch">
                  {posts.map((post) => (
                    <Card
                      key={post.post_id}
                      bg={cardBg}
                      border="1px"
                      borderColor={borderColor}
                      shadow="md"
                      _hover={{
                        shadow: 'lg',
                        borderColor: primaryColor
                      }}
                      transition="all 0.3s"
                      cursor="pointer"
                      onClick={() => handleViewPost(post.post_id)}
                    >
                      <CardBody>
                        <Flex gap={4}>
                          <Image
                            src={post.images?.[0] || 'https://via.placeholder.com/120x120?text=No+Image'}
                            alt={post.title}
                            w="120px"
                            h="120px"
                            objectFit="cover"
                            rounded="md"
                            fallbackSrc="https://via.placeholder.com/120x120?text=Image+Error"
                          />
                          <Box flex={1}>
                            <Flex justify="space-between" align="start" mb={2}>
                              <Box flex={1}>
                                <Heading size="md" color="white" mb={1} fontWeight="bold">
                                  {post.title}
                                </Heading>
                                <Text fontSize="sm" color="gray.400" noOfLines={2}>
                                  {post.description}
                                </Text>
                              </Box>
                              <Text fontSize="xl" fontWeight="bold" color={primaryColor}>
                                {formatPrice(post.price)}
                              </Text>
                            </Flex>
                            <Flex justify="space-between" align="center">
                              <HStack spacing={2}>
                                <Badge colorScheme={getRarityColor(post.rarity)} variant="solid" fontSize="sm">
                                  {rarities.find(r => r.value === post.rarity)?.icon} {post.rarity}
                                </Badge>
                                <Badge colorScheme="gray" variant="outline" fontSize="sm">
                                  {post.condition}
                                </Badge>
                                {post.tradeable && (
                                  <Badge colorScheme="blue" variant="outline" fontSize="sm">
                                    Troca
                                  </Badge>
                                )}
                              </HStack>
                              <Button
                                size="sm"
                                colorScheme="blue"
                                variant="solid"
                                bg={primaryColor}
                                _hover={{ bg: '#2563EB' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewPost(post.post_id);
                                }}
                              >
                                Ver Detalhes
                              </Button>
                            </Flex>
                          </Box>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              )
            ) : (
              /* Empty State */
              <Card bg={cardBg} border="1px" borderColor={borderColor} textAlign="center" py={12}>
                <CardBody>
                  <StarIcon boxSize={16} color="gray.400" mb={4} />
                  <Heading size="lg" color="gray.400" mb={2}>
                    Nenhum item encontrado
                  </Heading>
                  <Text color="gray.500" mb={6}>
                    Tente ajustar os filtros ou criar um novo anúncio
                  </Text>
                  <Button
                    onClick={handleCreatePost}
                    colorScheme="blue"
                    leftIcon={<AddIcon />}
                    bg={primaryColor}
                    _hover={{ bg: '#2563EB' }}
                  >
                    Criar Primeiro Anúncio
                  </Button>
                </CardBody>
              </Card>
            )}
          </Box>
        )}
      </Container>

      {/* Quick View Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={cardBg} border="1px" borderColor={borderColor}>
          <ModalHeader color="white">
            {selectedPost?.title}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            {selectedPost && (
              <VStack spacing={4} align="stretch">
                <Image
                  src={selectedPost.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={selectedPost.title}
                  w="100%"
                  h="300px"
                  objectFit="cover"
                  rounded="md"
                  fallbackSrc="https://via.placeholder.com/400x300?text=Image+Error"
                />
                <Text color="gray.300" fontSize="lg">
                  {selectedPost.description}
                </Text>
                <Flex justify="space-between" align="center">
                  <HStack spacing={2}>
                    <Badge colorScheme={getRarityColor(selectedPost.rarity)} variant="solid">
                      {rarities.find(r => r.value === selectedPost.rarity)?.icon} {selectedPost.rarity}
                    </Badge>
                    <Badge colorScheme="gray" variant="outline">
                      {selectedPost.condition}
                    </Badge>
                    {selectedPost.tradeable && (
                      <Badge colorScheme="blue" variant="outline">
                        Aceita Troca
                      </Badge>
                    )}
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color={primaryColor}>
                    {formatPrice(selectedPost.price)}
                  </Text>
                </Flex>
                <Button
                  colorScheme="blue"
                  size="lg"
                  bg={primaryColor}
                  _hover={{ bg: '#2563EB' }}
                  onClick={() => {
                    onClose();
                    handleViewPost(selectedPost.post_id);
                  }}
                >
                  Ver Detalhes Completos
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
