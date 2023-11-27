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
    this.setBg('/images/yuanling/1.png');

    // 加载另一张图片
    // fabric.Image.fromURL('/tz1.png', function (img) {
    //   // 将图片添加到canvas中
    //   canvas.add(img);
    // });
  };

  addImg = (src: string) => {
    const canvas = this.canvas;
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(src, function (img: fabric.Image) {
        // 将图片添加到canvas中

        img.set({
          originX: 'center',
          originY: 'center',
          scaleX: (canvas.width * 0.1) / img.width,
          // 图片的高度将会根据canvas的高度进行自适应缩放
          scaleY: (canvas.width * 0.1) / img.width,
          left: 150,
          top: 140,
        });

        canvas.add(img);
        resolve(img);
      });

      // setTimeout(() => {
      //   img.set({
      //     left: 300,
      //     top: 300,
      //   });
      //   canvas.renderAll();
      // }, 2000);
    });
  };

  setBg = (src) => {
    console.log('src');
    console.log(src);
    const canvas = this.canvas;

    console.log('canvas.width');
    console.log(canvas.width);
    console.log('canvas.height');
    console.log(canvas.height);
    fabric.Image.fromURL(src, (img) => {
      console.log('img');
      console.log(img);

      // 设置图片为背景图并置于底部
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        // width: canvas.width,
        // height: canvas.height,
        originX: 'left',
        originY: 'top',
        // scaleX: 1,
        // scaleY: 1,
        // 图片的宽度将会根据canvas的宽度进行自适应缩放
        scaleX: canvas.width / img.width,
        // 图片的高度将会根据canvas的高度进行自适应缩放
        scaleY: canvas.height / img.height,
        top: 0,
        left: 0,
        selectable: false,
      });
    });
  };

  handleClick = () => {
    const exportScale = 2; // 导出为原始分辨率的两倍

    // 导出合成后的图片
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      multiplier: exportScale,
    });

    // 创建一个链接元素并设置下载属性
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'composite_image.png';

    // 触发点击链接的事件
    link.click();
  };

  render() {
    return (
      <div>
        <canvas ref={this.canvasRef} id="canvas" width="512" height="600" />
        <Button onClick={this.handleClick}>保存</Button>
      </div>
    );
  }
}

export default Fabric;
