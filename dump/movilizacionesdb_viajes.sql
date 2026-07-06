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
-- Table structure for table `viajes`
--

DROP TABLE IF EXISTS `viajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viajes` (
  `id_viaje` int NOT NULL AUTO_INCREMENT,
  `kms_inicial` int NOT NULL,
  `fecha_hora_inicio` datetime DEFAULT NULL,
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
  `estado_viaje` enum('En espera','En proceso','Terminado') NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `patente` varchar(15) DEFAULT NULL,
  `lat_fin_real` decimal(10,8) DEFAULT NULL,
  `lng_fin_real` decimal(11,8) DEFAULT NULL,
  `nombre_funcionario` varchar(100) NOT NULL,
  `vehiculo` varchar(100) NOT NULL,
  `kms_fin` int NOT NULL,
  `modo` varchar(10) NOT NULL DEFAULT 'ida',
  PRIMARY KEY (`id_viaje`),
  KEY `fk_usuario_viaje` (`id_usuario`),
  KEY `fk_vehiculo_viaje` (`patente`),
  CONSTRAINT `fk_usuario_viaje` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `fk_vehiculo_viaje` FOREIGN KEY (`patente`) REFERENCES `vehiculos` (`patente`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viajes`
--

LOCK TABLES `viajes` WRITE;
/*!40000 ALTER TABLE `viajes` DISABLE KEYS */;
INSERT INTO `viajes` VALUES (1,10000,'2026-06-22 09:30:00',-34.63949100,-71.36594100,'2026-06-25 19:10:00',-34.62729700,-71.35344000,'Polideportivo Santa cruz','visita al polideportivo','pasa',1,200,'2026-06-25 19:10:00','Pepe pape','Terminado',1,'abc123',0.00000000,0.00000000,'Usuario prueba','Toyota',2500,'ida'),(2,12000,'2026-07-20 12:00:00',-34.63949100,-71.36594100,NULL,-34.59511300,-71.42851800,'Plaza Yaquil','Visita en terreno ',NULL,0,NULL,'2026-07-20 12:00:00','Usuario prueba','Terminado',1,'bc1245',NULL,NULL,'Usuario prueba','Suzuki',13000,'ida'),(27,10000,'2026-07-02 11:40:00',-34.63973900,-71.36591600,'2026-07-02 13:40:00',-34.39862081,-71.62073176,'test 6','test 6','test5',1,10,'2026-07-02 13:40:00','usuario prueba','Terminado',8,'abc123',NULL,NULL,'usuario prueba','Toyota',10020,'ida'),(29,1000,'2026-07-02 14:50:00',-34.63973900,-71.36591600,'2026-07-02 15:50:00',-34.62642196,-71.35173798,'test  6','test 6','test 6',1,10,'2026-07-02 15:50:00','usuario prueba','Terminado',8,'abc123',NULL,NULL,'usuario prueba','Toyota',1005,'ida'),(30,5000,'2026-07-02 16:55:00',-34.63973900,-71.36591600,'2026-07-02 16:55:00',-34.65257160,-71.19166378,'test 7','test 7','test 7',0,0,'2026-07-02 16:55:00','usuario prueba','Terminado',8,'cvfg12',NULL,NULL,'usuario prueba','Nissan',5005,'ida'),(31,5005,'2026-07-02 16:59:00',-34.65257160,-71.19166378,'2026-07-02 18:30:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde test 7','test 7 -fin',1,10,'2026-07-02 18:30:00','usuario prueba','Terminado',8,'cvfg12',NULL,NULL,'usuario prueba','Nissan',5010,'vuelta'),(32,12300,'2026-07-02 16:30:00',-34.63973900,-71.36591600,'2026-07-02 16:41:00',-34.63624093,-71.35242462,'pepe','pepe','01',0,0,'2026-07-02 16:41:00','Pepe Lopez','Terminado',9,'12pepe',NULL,NULL,'Pepe Lopez','peeplopez',12310,'ida'),(33,1005,'2026-07-02 16:00:00',-34.63973900,-71.36591600,'2026-07-02 20:00:00',-34.66214566,-71.41902345,'prueba','prueba','nada',0,0,'2026-07-02 20:00:00','usuario prueba','Terminado',8,'abc123',NULL,NULL,'usuario prueba','Toyota',1010,'ida'),(34,1010,'2026-07-02 18:10:00',-34.66214566,-71.41902345,'2026-07-02 20:10:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde prueba','---',0,0,'2026-07-02 20:10:00','usuario prueba','Terminado',8,'abc123',NULL,NULL,'usuario prueba','Toyota',1014,'vuelta'),(35,12310,'2026-07-02 16:47:00',-34.63624093,-71.35242462,'2026-07-02 20:50:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde pepe','',0,0,'2026-07-02 20:50:00','Pepe Lopez','Terminado',9,'12pepe',NULL,NULL,'Pepe Lopez','peeplopez',12312,'vuelta'),(36,1014,'2026-07-31 19:00:00',-34.63973900,-71.36591600,'2026-07-02 22:00:00',-34.63670044,-71.36289362,'','dddd','xxx',0,0,'2026-07-02 22:00:00','Pepe Lopez','Terminado',9,'abc123',NULL,NULL,'Pepe Lopez','Toyota',1020,'ida'),(37,1020,'2026-07-09 13:05:00',-34.63670044,-71.36289362,'2026-07-03 14:09:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde ','',0,0,'2026-07-03 14:09:00','Pepe Lopez','Terminado',9,'abc123',NULL,NULL,'Pepe Lopez','Toyota',1025,'vuelta'),(38,12000,'2026-07-03 15:55:00',-34.63973900,-71.36591600,'2026-07-03 16:00:00',-34.63546330,-71.36547089,'testing','asd','cccc',0,0,'2026-07-03 16:00:00','usuario prueba','Terminado',8,'bc1245',NULL,NULL,'usuario prueba','Suzuki',12005,'ida'),(39,12005,'2026-07-04 14:00:00',-34.63546330,-71.36547089,'2026-07-03 17:00:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde testing','fcf',1,3,'2026-07-03 17:00:00','usuario prueba','Terminado',8,'bc1245',NULL,NULL,'usuario prueba','Suzuki',12015,'vuelta'),(40,2100,NULL,-34.63973900,-71.36591600,NULL,-34.63827335,-71.36456966,'edit','test edit',NULL,0,NULL,'2026-07-06 12:26:00','Administrativo 1','En espera',9,'bbbb2',NULL,NULL,'Pepe Lopez','Ford',0,'ida');
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

-- Dump completed on 2026-07-06 14:32:12
