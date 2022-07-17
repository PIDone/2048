#include <cmath>
#include <iostream>
#include <random>
#include <sstream>
#include <string>
#include <vector>

#include "board.h"

int board::size = 4;

board::Tile** board::board;
int board::score = 0;

void board::decode(std::string text) {
	size = std::sqrt(text.length() / 2);
	board = new board::Tile*[size];

	std::stringstream stream(text);
	for (int i = 0; i < size; i++) {
		board[i] = new board::Tile[size];
		for (int j = 0; j < size; j++) {
			std::string token;
			std::getline(stream, token, ' ');
			board::board[i][j] = { std::stoi(token), false };
		}
	}
	stream >> board::score;
}
std::string board::encode() {
	std::string text = "";
	for (int i = 0; i < size; i++) {
		for (int j = 0; j < size; j++) {
			text += std::to_string(board::board[i][j].exponent);
			text += " ";
		}
	}
	text += std::to_string(board::score);
	return text;
}

void board::print() {
	for (int i = 0; i < size; i++) {
		for (int j = 0; j < size; j++)
			std::cout << board::board[i][j].exponent << " ";
		std::cout << "\n";
	}
}


void board::newTile() {
	std::vector<std::pair<int, int>> empty;
	for (int i = 0; i < size; i++) {
		for (int j = 0; j < size; j++) {
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
	for (int i = 0; i < size; i++) {
		int previous = -1;
		for (int j = 0; j < size; j++) {
			int current = board[i][j].exponent;
			if (current == 0 || current == previous)
				return false;
			previous = current;
		}
	}

	for (int i = 0; i < size; i++) {
		int previous = -1;
		for (int j = 0; j < size; j++) {
			int current = board[j][i].exponent;
			if (current == 0 || current == previous)
				return false;
			previous = current;
		}
	}

	return true;
}

void board::init(int size) {
	std::string text = "";
	for (int i = 0; i < size * size; i++)
		text += "0 ";
	text += "0";
	srand(time(nullptr));
	board::decode(text);
	board::newTile();
	board::newTile();
}