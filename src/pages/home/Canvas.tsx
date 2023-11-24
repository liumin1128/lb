import React from 'react';
import Button from '@mui/material/Button';
import { fabric } from 'fabric';

interface FabricProps {
  name: string;
}

function loadImg(src: string) {
  return new Promise((resolve, reject) => {
    const imgEl = document.createElement('img');
    imgEl.crossOrigin = 'Anonymous'; // 让图片能让所有人存取
    imgEl.src = src;
    imgEl.onload = () => {
      const image = new fabric.Image(imgEl, {
        scaleX: 0.2,
        scaleY: 0.2,
        // angle: 0,
        // angle: 15,
        top: 0,
        left: 0,
        // width: 600,
        // height: 800,
      });
      // 将 filters 实例 push 进 filters 里头
      image.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.2 }));
      // 这边需要重整所有的滤镜效果
      image.applyFilters();

      resolve(image);
    };
    imgEl.onerror = reject;
  });
}

class Fabric extends React.Component<FabricProps> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  canvas: any;

  constructor(props: FabricProps) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  componentDidMount() {
    this.load();
    // 图片
    // const imgEl = document.createElement('img');
    // imgEl.crossOrigin = 'Anonymous'; // 让图片能让所有人存取
    // imgEl.src = '/1.jpg';
    // imgEl.onload = () => {
    //   const image = new fabric.Image(imgEl, {
    //     scaleX: 0.5,
    //     scaleY: 0.5,
    //     angle: 0,
    //     // angle: 15,
    //     top: 0,
    //     left: 0,
    //   });
    //   // 将 filters 实例 push 进 filters 里头
    //   image.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.2 }));
    //   // 这边需要重整所有的滤镜效果
    //   image.applyFilters();
    //   canvas.add(image);
    //   const line = new fabric.Line([10, 20, 115, 110], {
    //     strokeWidth: 2,
    //     stroke: 'red',
    //     originX: 'center',
    //     originY: 'center',
    //   });
    //   canvas.add(line);
    // };
  }

  load = async () => {
    fabric.textureSize = 5120; // 限制图片上限为5M 1024*5=5120
    const canvas = new fabric.Canvas(this.canvasRef.current);
    this.canvas = canvas;

    // const img1 = await loadImg('/1.jpg');
    // const img2 = await loadImg('/tz1.png');

    // canvas.add(img1);
    // canvas.add(img2);

    // 加载图片
    fabric.Image.fromURL('/1.jpg', function (img) {
      // 设置图片为背景图并置于底部
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        // width: canvas.width,
        // height: canvas.height,
        originX: 'left',
        originY: 'top',
        scaleX: 0.2,
        scaleY: 0.2,
        top: 0,
        left: 0,
        selectable: false,
      });
    });

    // 加载另一张图片
    fabric.Image.fromURL('/tz1.png', function (img) {
      // 将图片添加到canvas中
      canvas.add(img);
    });
  };

  handleClick = () => {
    var exportScale = 2; // 导出为原始分辨率的两倍

    // 导出合成后的图片
    var dataURL = this.canvas.toDataURL({
      format: 'png',
      multiplier: exportScale,
    });

    // 创建一个链接元素并设置下载属性
    var link = document.createElement('a');
    link.href = dataURL;
    link.download = 'composite_image.png';

    // 触发点击链接的事件
    link.click();
  };

  render() {
    return (
      <div>
        <canvas
          ref={this.canvasRef}
          id="canvas"
          width="600"
          height="800"
        ></canvas>

        <Button onClick={this.handleClick}>保存</Button>
      </div>
    );
  }
}

export default Fabric;
