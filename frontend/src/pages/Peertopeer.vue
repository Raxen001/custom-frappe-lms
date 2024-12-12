<template>
  <div id="app">
    <div class="container">
      <h1>Welcome to Peer-to-Peer Network</h1>
      <p>Click below to navigate to WhatsApp pages:</p>
      <div class="links">
        <a href="https://chat.whatsapp.com/HXctutnYrNUH2QYuqbbukq" target="_blank" class="link-button">Tech Community</a>
        <a href="https://chat.whatsapp.com/J2k14biIqAy0BH74m2yglZ" target="_blank" class="link-button">Design Community</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WhatsAppLinksPage",
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #fdfbfb, #ebedee);
  color: #333;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#app {
  text-align: center;
  width: 100%;
}

.container {
  background: rgba(0, 0, 0, 0.05);
  padding: 50px 40px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-top: 7px solid #0077b6;
  max-width: 600px;
  width: 90%;
  text-align: center;
  margin: 0 auto;
}

h1 {
  font-size: 2.8rem;
  margin-bottom: 20px;
  color: #222;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

p {
  font-size: 1.3rem;
  margin-bottom: 30px;
  color: #555;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.links {
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
}

.link-button {
  text-decoration: none;
  background: linear-gradient(135deg, #90e0ef, #0077b6);
  color: #fff;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  transition: background 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.link-button:hover {
  background: linear-gradient(135deg, #0077b6, #90e0ef);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
</style>
