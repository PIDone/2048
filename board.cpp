#include <iostream>
#include <random>
#include <sstream>
#include <string>
#include <vector>

#include "board.h"

board::Tile board::board[4][4];
int board::score = 0;

void board::decode(std::string text) {
	std::stringstream stream(text);
	for (int i = 0; i < 4; i++) {
		for (int j = 0; j < 4; j++) {
			std::string token;
			std::getline(stream, token, ' ');
			board::board[i][j] = { std::stoi(token), false };
		}
	}
	stream >> board::score;
}
std::string board::encode() {
	std::string text = "";
	for (int i = 0; i < 4; i++) {
		for (int j = 0; j < 4; j++) {
			text += std::to_string(board::board[i][j].exponent);
			text += " ";
		}
	}
	text += std::to_string(board::score);
	return text;
}

void board::print() {
	for (int i = 0; i < 4; i++) {
		for (int j = 0; j < 4; j++)
			std::cout << board::board[i][j].exponent << " ";
		std::cout << "\n";
	}
}


void board::newTile() {
	std::vector<std::pair<int, int>> empty;
	for (int i = 0; i < 4; i++) {
		for (int j = 0; j < 4; j++) {
			if (board[i][j].exponent == 0)
				empty.push_back({ i, j });
		}
	}

	if (empty.size() == 0)
		return;

	int number = rand() % 10 == 0 ? 2 : 1;
	int selected = rand() % empty.size();

	board[empty[selected].first][empty[selected].second].exponent = number;
}
bool board::gameOver() {
	for (int i = 0; i < 4; i++) {
		int previous = -1;
		for (int j = 0; j < 4; j++) {
			int current = board[i][j].exponent;
			if (current == 0 || current == previous)
				return false;
			previous = current;
		}
	}

	for (int i = 0; i < 4; i++) {
		int previous = -1;
		for (int j = 0; j < 4; j++) {
			int current = board[j][i].exponent;
			if (current == 0 || current == previous)
				return false;
			previous = current;
		}
	}

	return true;
}

void board::init() {
	srand(time(nullptr));
	board::decode("0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0");
	board::newTile();
	board::newTile();
}