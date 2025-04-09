CREATE DATABASE  IF NOT EXISTS `acervo_receita_case` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `acervo_receita_case`;
-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: acervo_receita_case
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cargo`
--

DROP TABLE IF EXISTS `cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargo` (
  `idCargo` int NOT NULL AUTO_INCREMENT COMMENT 'Contém o número identificador único do cargo exercido pelo funcionário na empresa.\nexemplo:\n\ncargo \n000001  \n000022 \n000333 ',
  `descricao` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idCargo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo`
--

LOCK TABLES `cargo` WRITE;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
INSERT INTO `cargo` VALUES (1,'admin'),(7,'degustador'),(10,'usuarionormal'),(12,'leitor');
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `idCategoria` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  PRIMARY KEY (`idCategoria`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (3,'japonesa');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `composicao`
--

DROP TABLE IF EXISTS `composicao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `composicao` (
  `QuantidadeIngrediente` decimal(4,1) NOT NULL COMMENT 'Contém a quantidade de ingredientes utilizados em uma receita.\n\nexemplo:\n120\n800\n1/2',
  `idMedida` int NOT NULL COMMENT 'Contém o identificador único da medida da receita.\n\nexemplo:\n1 cl(colher) de sopa\n40kg\n2 maços\n1 peça',
  `idIngredientes` int NOT NULL COMMENT 'Contém o número identificador único dos ingredientes. ',
  `Receita_nome` varchar(45) NOT NULL,
  `idCozinheiro` int NOT NULL,
  PRIMARY KEY (`idIngredientes`,`Receita_nome`,`idCozinheiro`),
  KEY `fk_Composicao_Medida1_idx` (`idMedida`),
  KEY `fk_Composicao_Ingredientes1_idx` (`idIngredientes`),
  KEY `fk_Composicao_Receita1_idx` (`Receita_nome`,`idCozinheiro`),
  CONSTRAINT `fk_Composicao_Ingredientes1` FOREIGN KEY (`idIngredientes`) REFERENCES `ingredientes` (`idIngredientes`),
  CONSTRAINT `fk_Composicao_Medida1` FOREIGN KEY (`idMedida`) REFERENCES `medida` (`idMedida`),
  CONSTRAINT `fk_Composicao_Receita1` FOREIGN KEY (`Receita_nome`, `idCozinheiro`) REFERENCES `receita` (`nome`, `idCozinheiro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `composicao`
--

LOCK TABLES `composicao` WRITE;
/*!40000 ALTER TABLE `composicao` DISABLE KEYS */;
/*!40000 ALTER TABLE `composicao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `degustacao`
--

DROP TABLE IF EXISTS `degustacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `degustacao` (
  `Data_Degustacao` date NOT NULL COMMENT 'Contém a data de degustação da receita.\n\nexemplo:\n 17/06/2008',
  `Nota_Degustacao` decimal(3,1) NOT NULL COMMENT 'Contém a nota de degustação da receita.\n\nexemplo:\n está receita teve a nota: 4,7',
  `idDegustador` int NOT NULL COMMENT 'Contém a identificação única do funcionário na empresa.\n\nexemplo:\n000001\n000002',
  `Receita_nome` varchar(45) NOT NULL,
  `idCozinheiro` int NOT NULL,
  `Imagem` varchar(255) DEFAULT NULL COMMENT 'Contém o caminho ou URL da imagem da degustação.',
  PRIMARY KEY (`idDegustador`,`Receita_nome`,`idCozinheiro`),
  KEY `fk_Degustacao_Funcionário1_idx` (`idDegustador`),
  KEY `fk_Degustacao_Receita1_idx` (`Receita_nome`,`idCozinheiro`),
  CONSTRAINT `fk_Degustacao_Funcionário1` FOREIGN KEY (`idDegustador`) REFERENCES `funcionario` (`idFuncionario`),
  CONSTRAINT `fk_Degustacao_Receita1` FOREIGN KEY (`Receita_nome`, `idCozinheiro`) REFERENCES `receita` (`nome`, `idCozinheiro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `degustacao`
--

LOCK TABLES `degustacao` WRITE;
/*!40000 ALTER TABLE `degustacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `degustacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foto`
--

DROP TABLE IF EXISTS `foto`;


--
-- Table structure for table `funcionario`
--

DROP TABLE IF EXISTS `funcionario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionario` (
  `idFuncionario` int NOT NULL AUTO_INCREMENT COMMENT 'Contém o número identificador único do funcionário na empresa.\n\nexemplo:\n000001\n000022\n000333',
  `Nome` varchar(100) NOT NULL COMMENT 'Contem o nome do funcionario contratado pela empresa.\n\nexemplo:\nidfuncionario   Nome\n\n   000001         Paulo\n   000002         Ana',
  `Rg` char(15) NOT NULL COMMENT 'Contem o registro único de identificação do funcionario.\n\nexemplo:\n083.531. 04 18 ssp-df\n11.131.155 ssp-df ',
  `Data_admissao` date NOT NULL COMMENT 'Contém a data de contratação do funcionário pela empresa.\n\nexemplo:\n\n02/04/2002\n26/01/2021',
  `Salario` decimal(12,2) NOT NULL COMMENT 'Contem o valor em R$ 999.999.999,99, em pagamento mensal pelos serviços prestados, pelos funcionários à empresa.\n\nexemplo:\n\nR$ 12.000,00\nR$  8.450,00',
  `idCargo` int NOT NULL COMMENT 'Contém o número do identicador único, do cargo.',
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nome_fantasia` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idFuncionario`),
  KEY `fk_Funcionário_Cargo_idx` (`idCargo`),
  CONSTRAINT `fk_Funcionário_Cargo` FOREIGN KEY (`idCargo`) REFERENCES `cargo` (`idCargo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario`
--

LOCK TABLES `funcionario` WRITE;
/*!40000 ALTER TABLE `funcionario` DISABLE KEYS */;
INSERT INTO `funcionario` VALUES (3,'mateus','3123','2024-05-08',200.0,1,'mateus','$2b$10$xjWL4JHNkAmHxh25.DBepurE2WybMUqQx2L7ztDn3rxsan2.cRJ/.',NULL),(4,'teste','123123','2024-05-08',211.0,1,'teste','$2b$10$WWYyC7jOq9biyktN7W7DIeioty3x40TMFbRb0IIuiexRhJpisdP9y',NULL),(5,'Ricardo','301293','2024-05-22',200.0,1,'admin@gmail.com','$2b$10$thAD/70k/3tXg1ourMluUuQ2T6/f0l83u6QPa1O5M.Drn6dyo0jqi',NULL),(6,'mateus','1234','2024-05-07',200.0,1,'mateusmartinscg@gmail.com','1234',NULL);
/*!40000 ALTER TABLE `funcionario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredientes`
--

DROP TABLE IF EXISTS `ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredientes` (
  `idIngredientes` int NOT NULL AUTO_INCREMENT COMMENT 'Contém o número identificador único dos ingredientes. \n\nexemplo:\n000042 tomate\n000273 carne\n000150 farinha de trigo ',
  `Nome` char(30) NOT NULL COMMENT 'Contém o nome do igrediente da receita.\n\nexemplo:\ntomate\ncarne\nfarinha de trigo ',
  `descricao` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idIngredientes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredientes`
--

LOCK TABLES `ingredientes` WRITE;
/*!40000 ALTER TABLE `ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `livro`
--

DROP TABLE IF EXISTS `livro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livro` (
  `idLivro` int NOT NULL AUTO_INCREMENT COMMENT 'Contém o identificador único do livro.\n\nexemplo:\n00008\n00080\n00800',
  `Titulo` varchar(45) NOT NULL COMMENT 'Contém o nome do livro.\n\nExemplo:\nE o vento levou.',
  `ISBN` decimal(13,0) NOT NULL COMMENT 'Contém o código do International Standard Book Number.\n\nExemplo:\n 978-65-5941-167-2',
  `idEditor` int NOT NULL COMMENT 'Contém o número identificador único do funcionário na empresa.\n\nexemplo:\n000001\n000022\n000333',
  PRIMARY KEY (`idLivro`),
  KEY `fk_Livro_Funcionário1_idx` (`idEditor`),
  CONSTRAINT `fk_Livro_Funcionário1` FOREIGN KEY (`idEditor`) REFERENCES `funcionario` (`idFuncionario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livro`
--

LOCK TABLES `livro` WRITE;
/*!40000 ALTER TABLE `livro` DISABLE KEYS */;
/*!40000 ALTER TABLE `livro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medida`
--

DROP TABLE IF EXISTS `medida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medida` (
  `idMedida` int NOT NULL AUTO_INCREMENT COMMENT 'Contém o identificador único da medida da receita.\n\nexemplo:\n1 cl(colher) de sopa\n40kg\n2 maços\n1 peça',
  `Descricao` varchar(45) NOT NULL COMMENT 'Contém a descrição do produto descrito na receita.\n\nexemplo:\nde maracujá.\nde açucar.\nde chocolate.\nde carne.',
  PRIMARY KEY (`idMedida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medida`
--

LOCK TABLES `medida` WRITE;
/*!40000 ALTER TABLE `medida` DISABLE KEYS */;
/*!40000 ALTER TABLE `medida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametro_sistema`
--

DROP TABLE IF EXISTS `parametro_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parametro_sistema` (
  `Mes_Producao` date NOT NULL COMMENT 'Contém a data do mês vigente, em que a receita foi feita.\n\nExemplo:\n22/03/96',
  `Ano_Producao` year NOT NULL COMMENT 'Contém a data do ano vigente, em que a receita foi feita.\n\nExemplo:\nano 2012',
  `Quantidade_receita` varchar(45) NOT NULL COMMENT 'Contém a quantidade da receita.\n\nExemplo:\n22/03/96',
  PRIMARY KEY (`Mes_Producao`,`Ano_Producao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametro_sistema`
--

LOCK TABLES `parametro_sistema` WRITE;
/*!40000 ALTER TABLE `parametro_sistema` DISABLE KEYS */;
/*!40000 ALTER TABLE `parametro_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicacao`
--

DROP TABLE IF EXISTS `publicacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicacao` (
  `idLivro` int NOT NULL,
  `Nome_Receita` varchar(45) NOT NULL COMMENT 'Contém o número identificador único da receita.\n\nexemplo:\n0000001\n0000022\n0000333',
  `idFuncionario` int NOT NULL COMMENT 'Contém o número identificador único do funcionário na empresa.\n\nexemplo:\n000001\n000022\n000333',
  PRIMARY KEY (`idLivro`,`Nome_Receita`,`idFuncionario`),
  KEY `fk_Publicacao_Receita1_idx` (`Nome_Receita`,`idFuncionario`),
  CONSTRAINT `fk_Publicacao_Livro1` FOREIGN KEY (`idLivro`) REFERENCES `livro` (`idLivro`),
  CONSTRAINT `fk_Publicacao_Receita1` FOREIGN KEY (`Nome_Receita`, `idFuncionario`) REFERENCES `receita` (`nome`, `idCozinheiro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicacao`
--

LOCK TABLES `publicacao` WRITE;
/*!40000 ALTER TABLE `publicacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `publicacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receita`
--

DROP TABLE IF EXISTS `receita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receita` (
  `nome` varchar(45) NOT NULL COMMENT 'Contém a identificação única da receita do livro.\n\nexemplo: \n00012\n00198\n\n',
  `Data` date NOT NULL COMMENT 'Contém a data da receita.\n\nExemplo:\n22/01/88',
  `ModoPreparo` varchar(1000) NOT NULL COMMENT 'Contém o modo de preparo da receita.\n\nexemplo:\nPara prepararmos está deliciosa receita, iremos precisar de...',
  `QuantidadePorcao` decimal(4,1) NOT NULL COMMENT 'Contém o número de porções que a receita rende.\n\nexemplo:\nEstá receita rende 10 porções.',
  `IndRecInedita` varchar(45) NOT NULL COMMENT 'Contém o indicativo de receita indireta.',
  `idCozinheiro` int NOT NULL COMMENT 'Contém o número identificador único do funcionário na receita.\n\nexemplo:\n000001\n000022\n000330',
  `Categoria` int NOT NULL,
  PRIMARY KEY (`nome`,`idCozinheiro`),
  KEY `fk_Receita_Funcionário1_idx` (`idCozinheiro`),
  KEY `fk_Receita_Categoria1_idx` (`Categoria`),
  CONSTRAINT `fk_Receita_Categoria1` FOREIGN KEY (`Categoria`) REFERENCES `categoria` (`idCategoria`),
  CONSTRAINT `fk_Receita_Funcionário1` FOREIGN KEY (`idCozinheiro`) REFERENCES `funcionario` (`idFuncionario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receita`
--

LOCK TABLES `receita` WRITE;
/*!40000 ALTER TABLE `receita` DISABLE KEYS */;
/*!40000 ALTER TABLE `receita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referencia`
--

DROP TABLE IF EXISTS `referencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referencia` (
  `Data_Inicio` date NOT NULL COMMENT 'Contém a data do inicio da referência.\n\nexemplo:\n01/03/2002',
  `Data_Fim` date NOT NULL COMMENT 'Contém a data do término da referência.\n\nexemplo:\n31/07/2021',
  `idFuncionario` int NOT NULL COMMENT 'Contém o número do identicador único, do funcionário.\n\nexemplo:\n0000025\n0001872\n0004237',
  `idRestaurante` int NOT NULL COMMENT 'Contém o número do identicador único, do restaurante.\n\nexemplo:\n',
  PRIMARY KEY (`idFuncionario`,`idRestaurante`),
  KEY `fk_Referência_Restaurante1_idx` (`idRestaurante`),
  CONSTRAINT `fk_Referência_Funcionário1` FOREIGN KEY (`idFuncionario`) REFERENCES `funcionario` (`idFuncionario`),
  CONSTRAINT `fk_Referência_Restaurante1` FOREIGN KEY (`idRestaurante`) REFERENCES `restaurante` (`idRestaurante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referencia`
--

LOCK TABLES `referencia` WRITE;
/*!40000 ALTER TABLE `referencia` DISABLE KEYS */;
INSERT INTO `referencia` VALUES ('2024-06-02','2024-06-14',5,3);
/*!40000 ALTER TABLE `referencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurante`
--

DROP TABLE IF EXISTS `restaurante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurante` (
  `idRestaurante` int NOT NULL AUTO_INCREMENT COMMENT 'Contém o número identificador único do restaurante. \n\nexemplo:\nChurrascaria Guaúcha\nCozinha Mineira',
  `Nome` varchar(45) NOT NULL COMMENT 'Contém o nome do restaurante.\n\nexemplo:\nCostelaria.\nAcarajé do Bel.',
  PRIMARY KEY (`idRestaurante`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurante`
--

LOCK TABLES `restaurante` WRITE;
/*!40000 ALTER TABLE `restaurante` DISABLE KEYS */;
INSERT INTO `restaurante` VALUES (3,'casa italia'),(4,'casa japa');
/*!40000 ALTER TABLE `restaurante` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-04 10:24:45
