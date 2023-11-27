import React, { createRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Canvas from './Canvas';

const kuanShiList = [
  { label: '圆领', key: 'yuanling' },
  { label: '连帽', key: 'lianmao' },
  { label: '短袖', key: 'duanxiu' },
];

const weizhiList = [
  { label: '左胸', key: 'left', left: 172, top: 140, rotate: 0 },
  { label: '中间', key: 'center', left: 256, top: 140, rotate: 0 },
  { label: '右胸', key: 'right', left: 340, top: 140, rotate: 0 },
  { label: '左袖', key: 'leftHand', left: 140, top: 390, rotate: -45 },
  { label: '右袖', key: 'rightHand', left: 370, top: 400, rotate: 45 },
];

const Home: React.FunctionComponent = () => {
  const [kuanShi, setKuanShi] = React.useState('yuanling');
  const [color, setColor] = React.useState(0);
  const [zuoXiong, setZuoxiong] = React.useState();
  const [tuzhang, setTuzhang] = React.useState([]);
  const canvasRef = createRef<any>();

  const handleClickKuanShi = (key: string) => {
    setKuanShi(key);
    const src = `/images/${key}/${color + 1}.png`;
    canvasRef.current.setBg(src);
  };

  const handleClickColor = (index: number) => {
    setColor(index);
    const src = `/images/${kuanShi}/${index + 1}.png`;
    canvasRef.current.setBg(src);
  };

  const addImg = async (src: string | ArrayBuffer | null) => {
    const img = await canvasRef.current.addImg(src);
    console.log('img');
    console.log(img);
    setTuzhang([...tuzhang, img]);
    // setZuoxiong(img);
  };

  const handleUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const src = reader.result;
        resolve(src);
      };
    });
  };

  const handleFileInputChange = async (e) => {
    const imgList = [];
    const fileList = [];
    const cr = canvasRef.current;

    if (e.target?.files && e.target?.files.length > 0) {
      for (let i = 0; i < e.target?.files.length; i++) {
        const file = e.target?.files[i];
        fileList.push(file);
      }
    }

    await Promise.all(
      fileList.map(async (file) => {
        const src = await handleUpload(file);
        const img = await cr.addImg(src);
        imgList.push(img);
      }),
    );

    setTuzhang([...tuzhang, ...imgList]);
  };

  return (
    <Container>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={4}>
          <Grid item md={4}>
            <Stack spacing={4}>
              <Stack spacing={1.5}>
                <Typography variant="h4">衣服款式</Typography>
                <Stack direction="row" spacing={1}>
                  {kuanShiList.map((item, index) => {
                    return (
                      <Button
                        variant={
                          item.key === kuanShi ? 'contained' : 'outlined'
                        }
                        key={item.key}
                        onClick={() => handleClickKuanShi(item.key)}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </Stack>
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="h4">衣服色号</Typography>
                <Grid container>
                  {new Array(22).fill(0).map((_, index) => {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Grid item key={index}>
                        <ButtonBase onClick={() => handleClickColor(index)}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              width: 48,
                              p: 0.5,
                              backgroundColor: (theme) =>
                                color === index
                                  ? theme.palette.primary.main
                                  : '',
                              // border: '1px transparent solid',
                              // borderColor: (theme) =>
                              //   color === index
                              //     ? theme.palette.primary.main
                              //     : '',
                            }}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                border: '1px #333 solid',
                                mb: 0.5,
                                backgroundImage: `url(/images/${kuanShi}/${
                                  index + 1
                                }.png)`,
                                backgroundSize: 'cover',
                              }}
                            />
                            <Typography variant="caption">
                              {index + 1}
                            </Typography>
                          </Box>
                        </ButtonBase>
                      </Grid>
                    );
                  })}
                </Grid>
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="h4">胸口位置</Typography>

                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    width: 'auto',
                  }}
                >
                  <Button size="small" variant="outlined">
                    上传图章
                  </Button>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInputChange}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'red',
                      zIndex: 1,
                      left: 0,
                      right: 0,
                      opacity: 0,
                    }}
                  />
                </Box>

                {tuzhang.map((i) => {
                  return (
                    <Stack key={i._element.currentSrc} direction="row">
                      <img
                        style={{
                          width: 128,
                          height: 128,
                          border: '1px #999 solid',
                        }}
                        src={i._element.currentSrc}
                        alt=""
                      />

                      <Box>
                        {weizhiList.map((item, index) => {
                          return (
                            <Button
                              key={item.key}
                              onClick={() => {
                                i.set({
                                  left: item.left,
                                  top: item.top,
                                  selectable: true,
                                });
                                i.rotate(item.rotate);
                                canvasRef.current.canvas.renderAll();
                              }}
                            >
                              {item.label}
                            </Button>
                          );
                        })}
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Grid>
          <Grid item md={8}>
            <Canvas ref={canvasRef} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
