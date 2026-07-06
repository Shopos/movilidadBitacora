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
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `correo` varchar(100) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `tipo_licencia` varchar(100) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `cargo` varchar(100) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  `estado_viaje_usuario` enum('Disponible','Asignado','En ruta') DEFAULT 'Disponible',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'usuario@munisantacruz.cl','usuario','A','usuario prueba','Funcionario',0,'Disponible'),(2,'admin@munisantacruz.cl','admin','A','admin prueba','Administracion',1,'Disponible'),(3,'usuariob@munisantacruz.cl','usuario bloq','B','usuario bloq','Funcionario',1,'Disponible'),(5,'pepelopez@muni.cl','$2b$11$JVdfdFzafroEjmZXP2D.cupZ8mNp02DX7c0hb81xIhvoLW6LoxUX6','A2','Pepe lopez','Funcionario',0,'Disponible'),(6,'admin@admin.cl','$2b$11$tDuBuEP/Ozav06yJjtL4IOIc/p90eLDX8C/rOq4mb0rSa/kRmMhii','A2','Administracion test','Administrativo',1,'Disponible'),(7,'admin@muni.cl','$2b$11$25xb/gS2yByMKzYDzAU5rOE85JSGMucVruH/2bWKny8OlBq0IaSz2','A1','Administrativo 1','Administrativo',1,'Disponible'),(8,'usuarioPrueba@muni.cl','$2b$11$I0../6qt5xNg5SoY/V3hyOPt/RAhDA5H37.EMf1P9bGP3FFsb8erq','A3','usuario prueba','Funcionario',1,'Disponible'),(9,'pepe.lopez@muni.cl','$2b$11$PQh7zLJAqoyPigPEe.zLs.zbaGtt2eVCM6Kml7tXWAKFpJsLaTT0m','A1','Pepe Lopez','Funcionario',1,'Asignado'),(10,'admin2@muni.cl','$2b$11$htkQrTbSLg2upThTuHbtM.2Gf4C5xWk6Fd.k31px3.UH/m0qm1S6a','A2','Admin dos','Administrativo',1,'Disponible');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-06 14:32:11
