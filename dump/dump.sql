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
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'usuario@munisantacruz.cl','usuario','A','usuario prueba','Funcionario',1),(2,'admin@munisantacruz.cl','admin','A','admin prueba','Administracion',1),(3,'usuariob@munisantacruz.cl','usuario bloq','B','usuario bloq','Funcionario',0),(5,'pepelopez@muni.cl','$2b$11$JVdfdFzafroEjmZXP2D.cupZ8mNp02DX7c0hb81xIhvoLW6LoxUX6','A2','Pepe lopez','Funcionario',1),(6,'admin@admin.cl','$2b$11$tDuBuEP/Ozav06yJjtL4IOIc/p90eLDX8C/rOq4mb0rSa/kRmMhii','A2','Administracion test','Administrativo',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`patente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES ('123','qwe',123000,'DISPONIBLE'),('12pepe','peeplopez',12300,'DISPONIBLE'),('abbb','Nissan',6111,'EN REPARACION'),('abbb2','Tesla',3300,'DISPONIBLE'),('abc123','Toyota',10000,'DISPONIBLE'),('bbbb2','Ford',2000,'DISPONIBLE'),('bc1245','Suzuki',12000,'DISPONIBLE'),('cvfg12','Nissan',5000,'DISPONIBLE'),('dc1243','Maxus',14000,'DISPONIBLE'),('fgk123','Subaru',16000,'DADO DE BAJA');
/*!40000 ALTER TABLE `vehiculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `viajes`
--

DROP TABLE IF EXISTS `viajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viajes` (
  `id_viaje` int NOT NULL AUTO_INCREMENT,
  `kms_inicial` int NOT NULL,
  `fecha_hora_inicio` datetime NOT NULL,
  `lat_inicio` decimal(10,8) NOT NULL,
  `lng_inicio` decimal(11,8) NOT NULL,
  `fecha_hora_fin` datetime DEFAULT NULL,
  `lat_fin` decimal(10,8) DEFAULT NULL,
  `lng_fin` decimal(11,8) DEFAULT NULL,
  `destino` varchar(100) DEFAULT NULL,
  `motivo` text NOT NULL,
  `obs_viaje` text,
  `carga_combustible` tinyint(1) DEFAULT '0',
  `cantidad_carga` int DEFAULT NULL,
  `ultima_modificacion` datetime NOT NULL,
  `modificado_por` varchar(100) NOT NULL,
  `estado_viaje` tinyint(1) DEFAULT '1',
  `id_usuario` int DEFAULT NULL,
  `patente` varchar(15) DEFAULT NULL,
  `lat_fin_real` decimal(10,8) DEFAULT NULL,
  `lng_fin_real` decimal(11,8) DEFAULT NULL,
  `nombre_funcionario` varchar(100) NOT NULL,
  `vehiculo` varchar(100) NOT NULL,
  `kms_fin` int NOT NULL,
  PRIMARY KEY (`id_viaje`),
  KEY `fk_usuario_viaje` (`id_usuario`),
  KEY `fk_vehiculo_viaje` (`patente`),
  CONSTRAINT `fk_usuario_viaje` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `fk_vehiculo_viaje` FOREIGN KEY (`patente`) REFERENCES `vehiculos` (`patente`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viajes`
--

LOCK TABLES `viajes` WRITE;
/*!40000 ALTER TABLE `viajes` DISABLE KEYS */;
INSERT INTO `viajes` VALUES (1,10000,'2026-06-22 09:30:00',-34.63949100,-71.36594100,'2026-06-25 19:10:00',-34.62729700,-71.35344000,'Polideportivo Santa cruz','visita al polideportivo','pasa',1,200,'2026-06-25 19:10:00','Pepe pape',0,1,'abc123',0.00000000,0.00000000,'Usuario prueba','Toyota',2500),(2,12000,'2026-07-20 12:00:00',-34.63949100,-71.36594100,NULL,-34.59511300,-71.42851800,'Plaza Yaquil','Visita en terreno ',NULL,0,NULL,'2026-07-20 12:00:00','Usuario prueba',1,1,'bc1245',NULL,NULL,'Usuario prueba','Suzuki',13000),(10,10000,'2026-06-10 12:00:00',-34.63973900,-71.36591600,'2026-06-25 19:10:00',-34.63457589,-71.36597514,'','promesa','pasa',1,200,'2026-06-25 19:10:00','Pepe pape',0,2,'abc123',0.00000000,0.00000000,'Pepe pape','Toyota',2500),(11,12000,'2026-06-30 15:50:00',-34.63973900,-71.36591600,NULL,-34.63786884,-71.35967731,'','prueba completa #1',NULL,0,NULL,'2026-06-25 14:49:00','Pepe pape',1,2,'bc1245',NULL,NULL,'Pepe pape','Suzuki',0),(12,3300,'2026-06-26 15:00:00',-34.63973900,-71.36591600,'2026-06-25 00:00:00',-34.63490282,-71.35010934,'','prueba completa #2','',0,0,'2026-06-25 00:00:00','Pepe pape',0,2,'abbb2',0.00000000,0.00000000,'Pepe pape','Tesla',0),(13,2000,'2026-06-30 16:00:00',-34.63973900,-71.36591600,'2026-06-25 16:00:00',-34.63693314,-71.34596586,'','prueba #3','-.-',0,0,'2026-06-25 16:00:00','Pepe pape',0,2,'bbbb2',0.00000000,0.00000000,'Pepe pape','Ford',3000),(14,3300,'2026-06-27 18:00:00',-34.63973900,-71.36591600,'2026-06-25 00:00:00',-34.61977471,-71.37302399,'','test','',0,0,'2026-06-25 00:00:00','Pepe pape',0,2,'abbb2',0.00000000,0.00000000,'Pepe pape','Tesla',0),(15,10000,'2026-06-25 16:00:00',-34.63973900,-71.36591600,'2026-06-25 19:10:00',-34.63974351,-71.36620849,'','testing','pasa',1,200,'2026-06-25 19:10:00','Pepe pape',0,2,'abc123',0.00000000,0.00000000,'Pepe pape','Toyota',2500),(16,10000,'2026-06-30 18:10:00',-34.63973900,-71.36591600,'2026-06-25 19:10:00',-34.62805234,-71.34739540,'','testing ahora si','pasa',1,200,'2026-06-25 19:10:00','Pepe pape',0,2,'abc123',0.00000000,0.00000000,'Pepe pape','Toyota',2500);
/*!40000 ALTER TABLE `viajes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-26 11:03:07
