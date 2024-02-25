#ifndef ZENO_H
#define ZENO_H

#pragma once

#include <iostream>
#include <functional>
#include <variant>
#include <memory>
#include <optional>
#include <unordered_map>
#include <unordered_set>

namespace zeno {

typedef std::variant<int, bool, std::vector<int>> ZenoType;
typedef std::optional<ZenoType> ZenoParent;
typedef std::function<std::string(ZenoType, std::optional<ZenoType>)> ZenoLogger;

std::string INT(ZenoType value);

enum class ZenoAttr {
};

struct ZenoObject {
	std::unique_ptr<ZenoType> value;
	std::string name;
	ZenoParent parent;
	ZenoLogger logger;
};

class Zeno {
public:
	
	Zeno();

	void setCurrentLine(int line);
	void setCurrentLines(int lines);

	void enroll(std::string name, int* value, std::unordered_set<ZenoAttr> attrs = {});
	void enroll(std::string name, std::vector<int>* value);

private:
	std::string instructions;
	std::unordered_map<std::string, std::tuple<ZenoParent, std::unordered_set<ZenoAttr>>> objects;
};

}

#include "zeno.cpp"

#endif
