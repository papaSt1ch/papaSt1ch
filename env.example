
/*
 * Native Android 16 Implementation (Kotlin + Jetpack Compose)
 * Structure for compiling the mobile application.
 */

package com.motoengine.pro

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(colorScheme = darkColorScheme()) {
                MainScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen() {
    val navController = rememberNavController()
    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, "Каталог") },
                    label = { Text("Каталог") },
                    selected = true,
                    onClick = { /* Navigate */ }
                )
                // Additional items here
            }
        }
    ) { padding ->
        NavHost(navController, startDestination = "catalog", modifier = Modifier.padding(padding)) {
            composable("catalog") { CatalogScreen() }
            composable("advisor") { AIScreen() }
        }
    }
}

@Composable
fun CatalogScreen() {
    // Logic for loading engines from Repository
    LazyColumn {
        items(getMockEngines()) { engine ->
            EngineListItem(engine)
        }
    }
}

data class Engine(
    val id: String,
    val name: String,
    val power: Double,
    val brand: String
)

fun getMockEngines() = listOf(
    Engine("yx140", "YX 140", 11.5, "YX"),
    Engine("zs172", "ZS 172FMM", 21.0, "Zongshen")
)

@Composable
fun EngineListItem(engine: Engine) {
    Card(modifier = Modifier.fillMaxWidth().padding(8.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(engine.name, style = MaterialTheme.typography.headlineSmall)
            Text("${engine.power} л.с.", color = MaterialTheme.colorScheme.primary)
        }
    }
}
