#include <Eigen/Core>
#include <iostream>
#include <fstream>
#include <vector>

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

std::vector<std::unique_ptr<float[]>> LoadCubemapImages(const std::string &cubemapDir, int &width, int &height,
                      int &channel)
{
  auto face_count = 1;
  std::vector<std::string> cubemapNames{"111.png"}; //, "posx.jpg", "posy.jpg","negy.jpg", "posz.jpg", "negz.jpg"};
  std::vector<std::unique_ptr<float[]> > images(face_count);
  for (int i = 0; i < face_count; i++)
  {
    std::string filename = cubemapDir + "/" + cubemapNames[i];
    int w, h, c;
    float *image = stbi_loadf(filename.c_str(), &w, &h, &c, 3);
    if (!image)
    {
      std::cout << "Failed to load image: " << filename << std::endl;
      exit(-1);
    }
    if (i == 0)
    {
      width = w;
      height = h;
      channel = c;
    }
    else if (w != width || h != height || c != channel)
    {
      std::cout << "Dismatch resolution for 6 images in cubemap" << std::endl;
      exit(-1);
    }
    images[i] = std::unique_ptr<float[]>(image);
    int index = (0 * 128 + 0) * channel;
    // std::cout << images[i][index + 0] << "\t" << images[i][index + 1] << "\t"
    //           << images[i][index + 2] << std::endl;
    }
    std::cout<<images[0][0]*255<<std::endl;
    std::cout<<images[0][1]*255<<std::endl;
    std::cout<<images[0][2]*255<<std::endl;
    std::cout<<images[0][3]<<std::endl;
    std::cout<<images[0][4]<<std::endl;
    std::cout<<images[0][5]<<std::endl;
    std::cout<<channel<<std::endl;
    std::cout<<width<<std::endl;
    std::cout<<height<<std::endl;
    return images;
}

int main() {

  int width, height, channel;
  LoadCubemapImages("/Users/dushi/Documents/github/games202/c++/Indoor",width, height, channel);
  return 0;
}
