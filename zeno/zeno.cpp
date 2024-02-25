#pragma once

#include "zeno.h"

namespace zeno {

std::string INT(ZenoType value) {
	return std::to_string(std::get<int>(value));
}

Zeno::Zeno() { }

void Zeno::enroll(std::string name, int* value, std::unordered_set<ZenoAttr> attrs) {
	if (!objects.count(name)) {
		objects[name] = std::make_tuple(std::nullopt, attrs);
	}
}

}
