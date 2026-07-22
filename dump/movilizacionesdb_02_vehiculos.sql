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
-- Table structure for table `vehiculos`
--

DROP TABLE IF EXISTS `vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculos` (
  `patente` varchar(15) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `kms_actual` int NOT NULL,
  `estado` enum('DISPONIBLE','EN RUTA','EN REPARACION','DADO DE BAJA') NOT NULL,
  `tipo_vehiculo` varchar(100) DEFAULT 'Automovil',
  `licencia_min` varchar(4) DEFAULT 'B',
  PRIMARY KEY (`patente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES ('DSPL69','Volkswagen Aljibe',0,'DISPONIBLE','Camión','A4'),('FXHB22','JAC',0,'DISPONIBLE','Camión','A4'),('HVYY72','KIA',0,'DISPONIBLE','Automóvil','B'),('JJVB95','Mercedes Benz Atego',0,'DISPONIBLE','Camión','A4'),('KHXH51','Nissan',0,'EN RUTA','Camioneta','B'),('KRSW96','Retroexcavadora',0,'DISPONIBLE','Maquinaria','D'),('KWLW28','Nissan',0,'DISPONIBLE','Camioneta','B'),('LCJK18','Nissan',0,'DISPONIBLE','Camioneta','B'),('LKVX46','Volkswagen Tolva',0,'DISPONIBLE','Camión','A4'),('SKYP73','Mitsubishi Katana',0,'DISPONIBLE','Camioneta','B'),('SKYP74','Mitsubishi Katana',0,'DISPONIBLE','Camioneta','B'),('SSGW81','Mitsubishi Fuso',110,'DISPONIBLE','Camión','A4'),('SYVD41','Hyundai Staria',0,'DISPONIBLE','Furgón','A2'),('TBWW59','Volkswagen Aljibe',0,'DISPONIBLE','Camión','A4'),('TPLB28','Maxus T90',0,'DISPONIBLE','Camioneta','B'),('TPLB38','Maxus T90',0,'DISPONIBLE','Camioneta','B'),('TPTP13','NISSAN TEST ',0,'DISPONIBLE','Camioneta','B'),('TPZP31','Nissan Kiks',0,'DISPONIBLE','Automóvil','B'),('TPZS17','Nissan Navara',0,'DISPONIBLE','Camioneta','B');
/*!40000 ALTER TABLE `vehiculos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-21 14:16:08
