-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: movilizacionesdb
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `mantenciones`
--

DROP TABLE IF EXISTS `mantenciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mantenciones` (
  `id_mantencion` int NOT NULL AUTO_INCREMENT,
  `ultimo_cambio_aceite` date NOT NULL,
  `taller` varchar(100) NOT NULL,
  `ultima_mantencion` date DEFAULT NULL,
  `detalle_mantencion` text,
  `patente` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id_mantencion`),
  KEY `fk_vehiculo` (`patente`),
  CONSTRAINT `fk_vehiculo` FOREIGN KEY (`patente`) REFERENCES `vehiculos` (`patente`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mantenciones`
--

LOCK TABLES `mantenciones` WRITE;
/*!40000 ALTER TABLE `mantenciones` DISABLE KEYS */;
INSERT INTO `mantenciones` VALUES (1,'2026-06-23','LALA','2026-06-23','TEST 1','abc123'),(2,'2026-06-22','LAL','2026-06-22','Prueba 2','abc123'),(3,'2026-06-02','LALA','2026-06-09','Mantencion de ','bc1245'),(4,'2026-06-24','LOLO','2026-06-25','Prueba $4','abc123'),(5,'2026-06-23','LILI','2026-06-23','Prueba 5','abc123'),(6,'2026-06-25','LILI','2026-06-16','aaaa','abc123'),(8,'2026-06-25','LOLO','2026-06-26','LOOO','abc123');
/*!40000 ALTER TABLE `mantenciones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-26 10:56:03
