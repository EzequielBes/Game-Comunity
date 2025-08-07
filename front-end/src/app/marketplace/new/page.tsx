'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { createPost, CreatePostData, getCategories } from '../../../gateway/marketplace';
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Spinner,
  IconButton,
  Badge,
  Divider,
  Grid,
  GridItem,
  Card,
  CardBody,
  Heading,
  useColorModeValue,
  Container,
  Image,
  Progress,
  Tooltip
} from '@chakra-ui/react';
import { ArrowBackIcon, AddIcon, CheckIcon, StarIcon, ViewIcon, EditIcon } from '@chakra-ui/icons';

export default function NewPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    description: '',
    price: 0,
    category: '',
    rarity: '',
    condition: '',
    tradeable: false,
    seller_id: user?.account_id || '',
    images: [],
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  // Opções estáticas
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

  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const cardBg = useColorModeValue('gray.800', 'gray.800');
  const textColor = useColorModeValue('white', 'white');
  const borderColor = useColorModeValue('gray.600', 'gray.600');

  useEffect(() => {
    loadCategories();
    if (user?.account_id) {
      setFormData(prev => ({ ...prev, seller_id: user.account_id }));
    }
  }, [user]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Título deve ter pelo menos 3 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.rarity) {
      newErrors.rarity = 'Raridade é obrigatória';
    }

    if (!formData.condition) {
      newErrors.condition = 'Condição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos marcados",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createPost(formData);
      toast({
        title: "Sucesso!",
        description: "Anúncio criado com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push('/marketplace');
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: err.message || "Erro ao criar anúncio",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getCompletionPercentage = () => {
    const fields = ['title', 'description', 'price', 'category', 'rarity', 'condition'];
    const filledFields = fields.filter(field => {
      const value = formData[field as keyof CreatePostData];
      if (typeof value === 'string') {
        return value.trim() !== '';
      } else if (typeof value === 'number') {
        return value > 0;
      } else if (typeof value === 'boolean') {
        return value;
      }
      return false;
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  return (
    <Box minH="100vh" bg={bgColor} color={textColor} fontFamily="'Press Start 2P', cursive">
      {/* Background Pattern */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        backgroundImage="url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22 width=%2280%22 height=%2280%22%3E%3Cpath fill=%22%2363B3ED%22 fill-opacity=%220.3%22 d=%22M0 0h80v80H0zM20 20h40v40H20z%22/%3E%3C/svg%3E')"
        zIndex={-1}
      />

      {/* Header */}
      <Box bg={cardBg} borderBottom="1px" borderColor={borderColor} px={8} py={4} position="sticky" top={0} zIndex={10}>
        <Flex justify="space-between" align="center" maxW="7xl" mx="auto">
          <HStack spacing={4}>
            <IconButton
              aria-label="Voltar"
              icon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => router.push('/marketplace')}
              colorScheme="blue"
              _hover={{ bg: 'blue.600', color: 'white' }}
            />
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color="#63B3ED" mb={1}>
                Criar Novo Anúncio
              </Text>
              <Text fontSize="sm" color="gray.400">
                Compartilhe seus itens com a comunidade gamer
              </Text>
            </Box>
          </HStack>
          
          {/* Progress Indicator */}
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.400" mb={2}>
              Progresso
            </Text>
            <Progress value={getCompletionPercentage()} colorScheme="blue" size="sm" width="200px" />
            <Text fontSize="xs" color="gray.500" mt={1}>
              {getCompletionPercentage()}% completo
            </Text>
          </Box>
        </Flex>
      </Box>

      <Container maxW="6xl" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Form Section */}
          <GridItem>
            <Card bg={cardBg} border="1px" borderColor={borderColor} shadow="xl">
              <CardBody p={8}>
                <VStack spacing={8} align="stretch">
                  {/* Error Alert */}
                  {error && (
                    <Alert status="error" borderRadius="md" bg="red.900" color="white">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Erro!</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Box>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit}>
                    <VStack spacing={8} align="stretch">
                      {/* Basic Information */}
                      <Box>
                        <Heading size="md" color="#63B3ED" mb={6} display="flex" alignItems="center">
                          <EditIcon mr={3} />
                          Informações Básicas
                        </Heading>
                        
                        <VStack spacing={6}>
                          <FormControl isInvalid={!!errors.title}>
                            <FormLabel fontWeight="semibold" color="gray.300">Título do Anúncio</FormLabel>
                            <Input
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              placeholder="Ex: Skin rara do CS:GO"
                              size="lg"
                              bg="gray.700"
                              borderColor="gray.600"
                              color="white"
                              _focus={{ bg: 'gray.600', borderColor: '#63B3ED' }}
                              _placeholder={{ color: 'gray.400' }}
                            />
                            <FormErrorMessage>{errors.title}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!errors.description}>
                            <FormLabel fontWeight="semibold" color="gray.300">Descrição</FormLabel>
                            <Textarea
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              placeholder="Descreva detalhadamente o item..."
                              rows={4}
                              size="lg"
                              bg="gray.700"
                              borderColor="gray.600"
                              color="white"
                              _focus={{ bg: 'gray.600', borderColor: '#63B3ED' }}
                              _placeholder={{ color: 'gray.400' }}
                            />
                            <FormErrorMessage>{errors.description}</FormErrorMessage>
                          </FormControl>
                        </VStack>
                      </Box>

                      {/* Price and Category */}
                      <Box>
                        <Heading size="md" color="#63B3ED" mb={6} display="flex" alignItems="center">
                          <StarIcon mr={3} />
                          Detalhes do Item
                        </Heading>
                        
                        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                          <FormControl isInvalid={!!errors.price}>
                            <FormLabel fontWeight="semibold" color="gray.300">Preço (R$)</FormLabel>
                            <Input
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                              placeholder="0,00"
                              size="lg"
                              bg="gray.700"
                              borderColor="gray.600"
                              color="white"
                              _focus={{ bg: 'gray.600', borderColor: '#63B3ED' }}
                              _placeholder={{ color: 'gray.400' }}
                            />
                            <FormErrorMessage>{errors.price}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!errors.category}>
                            <FormLabel fontWeight="semibold" color="gray.300">Categoria</FormLabel>
                            <Select
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              placeholder="Selecione..."
                              size="lg"
                              bg="gray.700"
                              borderColor="gray.600"
                              color="white"
                              _focus={{ bg: 'gray.600', borderColor: '#63B3ED' }}
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat} style={{ backgroundColor: '#2D3748', color: 'white' }}>
                                  {cat}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{errors.category}</FormErrorMessage>
                          </FormControl>
                        </Grid>
                      </Box>

                      {/* Rarity and Condition */}
                      <Box>
                        <Heading size="md" color="#63B3ED" mb={6}>Especificações</Heading>
                        
                        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                          <FormControl isInvalid={!!errors.rarity}>
                            <FormLabel fontWeight="semibold" color="gray.300">Raridade</FormLabel>
                            <Select
                              name="rarity"
                              value={formData.rarity}
                              onChange={handleChange}
                              placeholder="Selecione..."
                              size="lg"
                              bg="gray.700"
                              borderColor="gray.600"
                              color="white"
                              _focus={{ bg: 'gray.600', borderColor: '#63B3ED' }}
                            >
                              {rarities.map(rarity => (
                                <option key={rarity.value} value={rarity.value} style={{ backgroundColor: '#2D3748', color: 'white' }}>
                                  {rarity.icon} {rarity.label}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{errors.rarity}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!errors.condition}>
                            <FormLabel fontWeight="semibold" color="gray.300">Condição</FormLabel>
                            <Select
                              name="condition"
                              value={formData.condition}
                              onChange={handleChange}
                              placeholder="Selecione..."
                              size="lg"
                              bg="gray.700"
                              borderColor="gray.600"
                              color="white"
                              _focus={{ bg: 'gray.600', borderColor: '#63B3ED' }}
                            >
                              {conditions.map(condition => (
                                <option key={condition.value} value={condition.value} style={{ backgroundColor: '#2D3748', color: 'white' }}>
                                  {condition.label}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{errors.condition}</FormErrorMessage>
                          </FormControl>
                        </Grid>
                      </Box>

                      {/* Tradeable Checkbox */}
                      <Box>
                        <FormControl>
                          <HStack spacing={4} p={4} bg="gray.700" borderRadius="md" border="1px" borderColor="gray.600">
                            <Checkbox
                              name="tradeable"
                              isChecked={formData.tradeable}
                              onChange={handleChange}
                              colorScheme="blue"
                              size="lg"
                            />
                            <Box>
                              <FormLabel fontWeight="semibold" mb={1} color="gray.300">
                                Disponível para troca
                              </FormLabel>
                              <Text fontSize="sm" color="gray.400">
                                Marque se o item pode ser trocado por outros itens
                              </Text>
                            </Box>
                          </HStack>
                        </FormControl>
                      </Box>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        height="60px"
                        fontSize="lg"
                        leftIcon={loading ? <Spinner size="sm" /> : <AddIcon />}
                        isLoading={loading}
                        loadingText="Criando anúncio..."
                        _hover={{ transform: 'scale(1.02)', bg: '#4299E1' }}
                        _active={{ transform: 'scale(0.98)' }}
                        transition="all 0.2s"
                        bg="#2B6CB0"
                        color="white"
                      >
                        {loading ? 'Criando Anúncio...' : 'Criar Anúncio'}
                      </Button>
                    </VStack>
                  </form>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Preview Section */}
          <GridItem>
            <Card bg={cardBg} border="1px" borderColor={borderColor} shadow="xl" position="sticky" top={24}>
              <CardBody p={6}>
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="#63B3ED" textAlign="center">
                    <ViewIcon mr={3} />
                    Preview do Anúncio
                  </Heading>

                  {formData.title ? (
                    <Box>
                      <Box border="1px" borderColor={borderColor} rounded="lg" p={4} bg="gray.700">
                        {/* Image Placeholder */}
                        <Box 
                          h="200px" 
                          bg="gray.600" 
                          rounded="md" 
                          mb={4}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="gray.400"
                        >
                          <VStack>
                            <AddIcon boxSize={8} />
                            <Text fontSize="sm">Imagem do Item</Text>
                          </VStack>
                        </Box>

                        {/* Title */}
                        <Text fontSize="lg" fontWeight="bold" color="white" mb={2} noOfLines={2}>
                          {formData.title}
                        </Text>

                        {/* Description */}
                        <Text fontSize="sm" color="gray.300" mb={4} noOfLines={3}>
                          {formData.description || "Descrição do item aparecerá aqui..."}
                        </Text>

                        {/* Badges */}
                        <HStack spacing={2} mb={4} flexWrap="wrap">
                          {formData.rarity && (
                            <Tooltip label={rarities.find(r => r.value === formData.rarity)?.label}>
                              <Badge colorScheme={rarities.find(r => r.value === formData.rarity)?.color || 'gray'} variant="solid">
                                {formData.rarity}
                              </Badge>
                            </Tooltip>
                          )}
                          {formData.condition && (
                            <Badge colorScheme="gray" variant="outline">
                              {formData.condition}
                            </Badge>
                          )}
                          {formData.tradeable && (
                            <Badge colorScheme="blue" variant="outline">
                              Troca
                            </Badge>
                          )}
                        </HStack>

                        {/* Price */}
                        {formData.price > 0 ? (
                          <Text fontSize="2xl" fontWeight="bold" color="#63B3ED">
                            {formatPrice(formData.price)}
                          </Text>
                        ) : (
                          <Text fontSize="lg" color="gray.400">
                            Preço não definido
                          </Text>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Box textAlign="center" py={8}>
                      <ViewIcon boxSize={12} color="gray.500" mb={4} />
                      <Text color="gray.400" fontSize="sm">
                        Preencha os campos para ver o preview do anúncio
                      </Text>
                    </Box>
                  )}

                  {/* Tips */}
                  <Box bg="blue.900" p={4} rounded="md" border="1px" borderColor="blue.600">
                    <Text fontSize="sm" color="blue.200" fontWeight="semibold" mb={2}>
                      💡 Dicas para um anúncio atrativo:
                    </Text>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color="blue.100">• Use títulos descritivos</Text>
                      <Text fontSize="xs" color="blue.100">• Inclua detalhes importantes</Text>
                      <Text fontSize="xs" color="blue.100">• Defina preços competitivos</Text>
                      <Text fontSize="xs" color="blue.100">• Adicione fotos de qualidade</Text>
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
